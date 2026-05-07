# MA-React Production Deployment Guide

**Target**: Shared Hosting (CPanel/Plesk) without SSH  
**Timeline**: 1-2 hours setup + testing  
**Last Updated**: 2026-05-02  

---

## PRE-DEPLOYMENT CHECKLIST

### Local Testing (Dev Machine)
```bash
# 1. Run smoke tests
# Follow SMOKE_TEST_CHECKLIST.md completely

# 2. Clear sensitive data
rm -rf backend/storage/logs/*.log
php artisan optimize

# 3. Build frontend production bundle
cd frontend
npm run build
# Verify build/ folder created and not empty
ls -lah build/

# 4. Backend production ready
cd ../backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan view:cache
```

### Update Environment Files

**backend/.env** (for your reference, will be set on server):
```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-domain.com
LOG_LEVEL=warning
DB_HOST=your-shared-hosting-mysql-host
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_secure_password
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

**frontend/.env.production** (critical - update BEFORE build):
```bash
REACT_APP_BACKEND_URL=https://your-backend-domain.com
```

---

## DEPLOYMENT STEPS

### 1. BUILD PRODUCTION ARTIFACTS

**On your local machine:**

```bash
# Frontend - Generate production build
cd frontend
npm run build
# Output: build/ folder with optimized JS/CSS

# Backend - Prepare for deployment
cd ../backend
composer install --no-dev --optimize-autoloader
# This reduces vendor/ size (important for shared hosting upload limits)
```

### 2. UPLOAD TO SHARED HOSTING

**Via FTP/CPanel File Manager:**

```
Your hosting structure should be:
/public_html/          (or /www/ depending on hosting)
├── index.html         (frontend build)
├── static/            (frontend CSS/JS)
├── api/               (backend - Laravel public folder)
└── storage/           (Laravel storage, writable)
```

**Recommended upload method:**
1. **Frontend (React build)**:
   - FTP upload `frontend/build/*` → `/public_html/`
   - Ensure `index.html` is in root

2. **Backend (Laravel)**:
   - FTP upload `backend/app/`, `backend/config/`, `backend/routes/`, etc. → `/public_html/api/`
   - FTP upload `backend/storage/` → `/public_html/storage/` (MUST be writable)
   - FTP upload `backend/vendor/` → `/public_html/api/vendor/` (only needed .php files for autoload)
   - FTP upload `backend/.env` (production) → `/public_html/api/.env`
   - FTP upload `backend/public/*` → `/public_html/api/public/`

**Alternatively - Using cPanel Auto-Deployment:**
- Some hosts allow GitHub integration
- Push to repo → Auto-deploy to hosting
- Check your hosting documentation

### 3. CONFIGURE WEB SERVER

**For Apache (most shared hosting):**

Create `.htaccess` in `/public_html/`:
```apache
# Redirect API requests to backend
RewriteEngine On
RewriteBase /

# Route /api/* to backend
RewriteRule ^api/(.*)$ /api/public/index.php?path=$1 [QSA,L]

# Route everything else to frontend
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(?!api).*$ index.html [QSA,L]
```

**For Nginx:**

Create `nginx.conf` configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/public_html;
    index index.html index.php;

    # Frontend (React) - serve build files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend (Laravel) - API routes
    location /api/ {
        alias /var/www/public_html/api/public/;
        try_files $uri $uri/ /api/public/index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### 4. SET FILE PERMISSIONS

**Via CPanel Terminal or FTP:**

```bash
# Make storage writable (Laravel logs, caches, uploads)
chmod -R 755 /public_html/storage
chmod -R 755 /public_html/api/storage

# Make bootstrap/cache writable
chmod -R 755 /public_html/api/bootstrap/cache
```

### 5. CREATE DATABASE & RUN MIGRATIONS

**Via CPanel MySQL Manager:**

```sql
CREATE DATABASE your_app_db;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON your_app_db.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

**Run migrations (two options):**

**Option A: Via Deployment Endpoint (Recommended for shared hosting)**

```bash
curl -X POST https://your-domain.com/api/admin/deploy?key=YOUR_SECRET_KEY \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

Response:
```json
{
  "status": "success",
  "message": "Deployment completed",
  "log": [
    "Migrations: ...",
    "Seeders: ...",
    "Storage symlink created",
    "Cache cleared"
  ]
}
```

**Option B: Via CPanel Terminal (if available)**

```bash
cd /public_html/api
php artisan migrate --force
php artisan db:seed
php artisan storage:link
php artisan config:cache
php artisan view:cache
```

### 6. VERIFY DEPLOYMENT

```bash
# 1. Check health endpoint
curl https://your-domain.com/api/health
# Expected: {"status":"ok",...}

# 2. Test login API
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mapulosari.sch.id","password":"admin123"}'
# Expected: {"access_token":"...","user":{...}}

# 3. Check public bootstrap
curl https://your-domain.com/api/public/bootstrap
# Expected: teacher list, student list, etc.

# 4. Frontend access
curl https://your-domain.com/ | head -20
# Expected: React app HTML

# 5. Monitor logs
tail -f /public_html/api/storage/logs/api.log
# Watch for errors
```

### 7. SSL CERTIFICATE

**Via CPanel:**
1. Go to SSL/TLS Status
2. Auto-issue Let's Encrypt certificate
3. Or use "Manage AutoSSL"
4. Wait 10-15 minutes for cert to activate

**Update .env** to use HTTPS:
```
APP_URL=https://your-domain.com
```

**Force HTTPS redirect in `.htaccess`:**
```apache
# Redirect HTTP to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## POST-DEPLOYMENT VERIFICATION

### Run Smoke Tests on Production

Follow `SMOKE_TEST_CHECKLIST.md` but accessing production domain:
- `https://your-domain.com` (frontend)
- `https://your-domain.com/api/*` (backend)

### Monitor First 24 Hours

```bash
# Check API logs for errors
tail -f api/storage/logs/api.log

# Monitor database performance
# Check shared hosting control panel for resource usage

# Test all CRUD operations manually
# - Login
# - Add guru/siswa
# - Edit
# - Delete
# - Upload photos
# - Public page access
```

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| **404 on `/api/*`** | Rewrite rules not working | Check `.htaccess` or web server config |
| **Photos not loading** | Storage symlink missing | Run `php artisan storage:link` |
| **Laravel 500 error** | Permission denied | `chmod 755 storage/` directories |
| **Database connection error** | Wrong credentials in `.env` | Verify DB host, user, password |
| **CORS error in console** | `CORS_ALLOWED_ORIGINS` wrong domain | Update `.env` with frontend domain |
| **Long load times** | Shared hosting limitations | Consider upgrade or caching strategy |
| **File upload 413** | Request size limit | Increase `upload_max_filesize` in PHP config |

---

## ONGOING MAINTENANCE

### Daily (Automated)
- Monitor error logs: `storage/logs/api.log`
- Check uptime (use monitoring service)
- Backup database (ask hosting provider for automated backup)

### Weekly
- Review API logs for suspicious activity
- Check storage space (photos grow over time)
- Verify email notifications (if configured)

### Monthly
- Clear old logs: `php artisan tinker` → `\File::delete(glob('storage/logs/*.log'));`
- Database optimization: `OPTIMIZE TABLE records;`
- Update dependencies: `composer update` (test locally first!)

### Quarterly
- Security audit:
  - Change admin password
  - Review user permissions
  - Check `.env` for exposed secrets
- Performance review:
  - Database query optimization
  - Caching strategy

---

## UPDATING PRODUCTION

### Minor Updates (Bug fixes, features)

```bash
# Local development
git pull origin main  # or your deployment branch

# Local testing
npm run build  # frontend
php artisan test  # backend

# Upload changes
# - FTP upload updated files
# - Run: php artisan migrate
# - Clear cache: php artisan cache:clear

# Minimal downtime approach:
# 1. Upload new code
# 2. Test with internal token
# 3. Switch traffic when ready
```

### Database Migrations

```bash
# ALWAYS backup first
# Via CPanel MySQL: Export database

# Run migration
php artisan migrate --force

# Verify data integrity
# Check key tables in CPanel MySQL manager
```

---

## ROLLBACK STRATEGY

### If Update Breaks Production

```bash
# Option 1: Restore previous code
# FTP upload previous backend/frontend versions
# Restart services

# Option 2: Restore database backup
# Via CPanel MySQL: Import previous backup
# Verify application works

# Option 3: Use deployment endpoint to reset
php artisan migrate:rollback --force
php artisan db:seed --force
```

---

## USEFUL COMMANDS (For CPanel Terminal)

```bash
# Check PHP version
php -v

# Check disk space
df -h

# Check RAM usage
free -m

# Clear Laravel cache
php artisan cache:clear
php artisan config:cache
php artisan view:cache

# View logs
tail -100 api/storage/logs/api.log
tail -100 api/storage/logs/api.log | grep ERROR

# Database backup
mysqldump -u user -p database > backup.sql

# Database restore
mysql -u user -p database < backup.sql
```

---

## SUPPORT & TROUBLESHOOTING

### Get Help
1. Check logs: `storage/logs/api.log`
2. Check Network tab (DevTools): See actual error responses
3. Check server error logs (CPanel → Error Log)
4. Test API directly: Use cURL or Postman

### Common Development Issues

**Issue**: "Field data harus berupa object" error  
**Solution**: Check frontend API call - ensure JSON serialization correct

**Issue**: Photos 404 in production  
**Solution**: Run `php artisan storage:link` on server

**Issue**: Slow performance  
**Solution**: Check shared hosting limits, consider optimization

---

## QUICK REFERENCE

| Task | Command | Notes |
|------|---------|-------|
| Build frontend | `npm run build` | Creates optimized bundle |
| Migrate DB | `php artisan migrate --force` | Add `--force` in production |
| Seed DB | `php artisan db:seed` | Idempotent - safe to run 2x |
| Create symlink | `php artisan storage:link` | Run once per server |
| Clear cache | `php artisan cache:clear` | After config changes |
| View logs | `tail -f storage/logs/api.log` | Monitor for errors |
| Test health | `curl /api/health` | Quick connectivity check |
| Deploy (via API) | `POST /api/admin/deploy?key=...` | Migrations + seeders + cache |

---

**You're ready for production! 🚀**

Remember: **Test thoroughly locally before production deployment.**
