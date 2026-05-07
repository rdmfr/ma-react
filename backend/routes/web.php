<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\PublicController;
use App\Http\Controllers\Web\PublicFormController;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\AdminSettingsController;
use App\Http\Controllers\Web\Admin\AdminRecordCrudController;
use App\Http\Controllers\Web\Admin\AdminReportCardsController;
use App\Http\Controllers\Web\Admin\AdminUsersController;
use App\Http\Controllers\Web\DashboardProfileController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', HomeController::class)->name('home');

Route::get('/profil', [PublicController::class, 'profil'])->name('profil');
Route::get('/guru', [PublicController::class, 'guruIndex'])->name('guru.index');
Route::get('/guru/{slug}', [PublicController::class, 'guruShow'])->name('guru.show');
Route::get('/program-studi', [PublicController::class, 'programStudi'])->name('program-studi');
Route::get('/modul', [PublicController::class, 'modul'])->name('modul');
Route::post('/modul/{record}/download', [PublicController::class, 'modulDownload'])->name('modul.download');
Route::get('/alumni', [PublicController::class, 'alumni'])->name('alumni');

Route::get('/ekstrakurikuler', [PublicController::class, 'ekstrakurikuler'])->name('ekstrakurikuler');
Route::get('/karya-siswa', [PublicController::class, 'karyaSiswa'])->name('karya-siswa');
Route::post('/karya-siswa/{record}/download', [PublicController::class, 'karyaSiswaDownload'])->name('karya-siswa.download');
Route::get('/galeri', [PublicController::class, 'galeriIndex'])->name('galeri');
Route::get('/galeri/{record}', [PublicController::class, 'galeriShow'])->name('galeri.show');
Route::get('/agenda', [PublicController::class, 'agenda'])->name('agenda');

Route::get('/berita', [PublicController::class, 'beritaIndex'])->name('berita.index');
Route::get('/berita/{slug}', [PublicController::class, 'beritaShow'])->name('berita.show');
Route::get('/refleksi', [PublicController::class, 'refleksiIndex'])->name('refleksi');
Route::get('/refleksi/{slug}', [PublicController::class, 'refleksiShow'])->name('refleksi.show');
Route::get('/pengumuman', [PublicController::class, 'pengumuman'])->name('pengumuman');
Route::get('/faq', [PublicController::class, 'faq'])->name('faq');

Route::get('/ppdb', fn () => view('public.ppdb'))->name('ppdb');
Route::post('/ppdb', [PublicFormController::class, 'ppdb'])->name('ppdb.submit');

Route::get('/kontak', fn () => view('public.kontak'))->name('kontak');
Route::post('/kontak', [PublicFormController::class, 'contact'])->name('kontak.submit');
Route::get('/search', [PublicController::class, 'search'])->name('search');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'loginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
    Route::get('/forgot-password', [AuthController::class, 'forgotForm'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'forgot'])->name('password.email');
    Route::get('/reset-password/{token}', [AuthController::class, 'resetForm'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'reset'])->name('password.update');
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/', fn () => view('dashboard.admin.overview'))->name('admin.home');

    Route::post('/records/{type}/upload', [AdminRecordCrudController::class, 'upload'])->name('admin.records.upload');
    Route::post('/records/{type}', [AdminRecordCrudController::class, 'store'])->name('admin.records.store');
    Route::put('/records/{type}/{record}', [AdminRecordCrudController::class, 'update'])->name('admin.records.update');
    Route::delete('/records/{type}/{record}', [AdminRecordCrudController::class, 'destroy'])->name('admin.records.destroy');

    Route::get('/approval', [AdminRecordCrudController::class, 'index'])->defaults('type', 'approvalQueue')->defaults('section', 'Admin')->name('admin.approval');
    Route::post('/approval', [AdminRecordCrudController::class, 'store'])->defaults('type', 'approvalQueue')->name('admin.approval.store');
    Route::put('/approval/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'approvalQueue')->name('admin.approval.update');
    Route::delete('/approval/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'approvalQueue')->name('admin.approval.destroy');

    Route::get('/teachers', [AdminRecordCrudController::class, 'index'])->defaults('type', 'teachers')->defaults('section', 'Admin')->name('admin.teachers');
    Route::post('/teachers', [AdminRecordCrudController::class, 'store'])->defaults('type', 'teachers')->name('admin.teachers.store');
    Route::put('/teachers/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'teachers')->name('admin.teachers.update');
    Route::delete('/teachers/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'teachers')->name('admin.teachers.destroy');

    Route::get('/students', [AdminRecordCrudController::class, 'index'])->defaults('type', 'students')->defaults('section', 'Admin')->name('admin.students');
    Route::post('/students', [AdminRecordCrudController::class, 'store'])->defaults('type', 'students')->name('admin.students.store');
    Route::put('/students/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'students')->name('admin.students.update');
    Route::delete('/students/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'students')->name('admin.students.destroy');

    Route::get('/academic-years', [AdminRecordCrudController::class, 'index'])->defaults('type', 'academicYears')->defaults('section', 'Admin')->name('admin.academic-years');
    Route::post('/academic-years', [AdminRecordCrudController::class, 'store'])->defaults('type', 'academicYears')->name('admin.academic-years.store');
    Route::put('/academic-years/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'academicYears')->name('admin.academic-years.update');
    Route::delete('/academic-years/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'academicYears')->name('admin.academic-years.destroy');

    Route::get('/subjects', [AdminRecordCrudController::class, 'index'])->defaults('type', 'subjects')->defaults('section', 'Admin')->name('admin.subjects');
    Route::post('/subjects', [AdminRecordCrudController::class, 'store'])->defaults('type', 'subjects')->name('admin.subjects.store');
    Route::put('/subjects/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'subjects')->name('admin.subjects.update');
    Route::delete('/subjects/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'subjects')->name('admin.subjects.destroy');

    Route::get('/scores', [AdminRecordCrudController::class, 'index'])->defaults('type', 'scores')->defaults('section', 'Admin')->name('admin.scores');
    Route::post('/scores', [AdminRecordCrudController::class, 'store'])->defaults('type', 'scores')->name('admin.scores.store');
    Route::put('/scores/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'scores')->name('admin.scores.update');
    Route::delete('/scores/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'scores')->name('admin.scores.destroy');

    Route::get('/modules', [AdminRecordCrudController::class, 'index'])->defaults('type', 'modules')->defaults('section', 'Admin')->name('admin.modules');
    Route::post('/modules', [AdminRecordCrudController::class, 'store'])->defaults('type', 'modules')->name('admin.modules.store');
    Route::put('/modules/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'modules')->name('admin.modules.update');
    Route::delete('/modules/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'modules')->name('admin.modules.destroy');

    Route::get('/ppdb', [AdminRecordCrudController::class, 'index'])->defaults('type', 'ppdbRegistrants')->defaults('section', 'Admin')->name('admin.ppdb');
    Route::post('/ppdb', [AdminRecordCrudController::class, 'store'])->defaults('type', 'ppdbRegistrants')->name('admin.ppdb.store');
    Route::put('/ppdb/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'ppdbRegistrants')->name('admin.ppdb.update');
    Route::delete('/ppdb/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'ppdbRegistrants')->name('admin.ppdb.destroy');

    Route::get('/messages', [AdminRecordCrudController::class, 'index'])->defaults('type', 'contactMessages')->defaults('section', 'Admin')->name('admin.messages');
    Route::post('/messages', [AdminRecordCrudController::class, 'store'])->defaults('type', 'contactMessages')->name('admin.messages.store');
    Route::put('/messages/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'contactMessages')->name('admin.messages.update');
    Route::delete('/messages/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'contactMessages')->name('admin.messages.destroy');

    Route::get('/notifications', [AdminRecordCrudController::class, 'index'])->defaults('type', 'notifications')->defaults('section', 'Admin')->name('admin.notifications');
    Route::post('/notifications', [AdminRecordCrudController::class, 'store'])->defaults('type', 'notifications')->name('admin.notifications.store');
    Route::put('/notifications/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'notifications')->name('admin.notifications.update');
    Route::delete('/notifications/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'notifications')->name('admin.notifications.destroy');

    Route::get('/activity', [AdminRecordCrudController::class, 'index'])->defaults('type', 'activityLog')->defaults('section', 'Admin')->name('admin.activity');
    Route::post('/activity', [AdminRecordCrudController::class, 'store'])->defaults('type', 'activityLog')->name('admin.activity.store');
    Route::put('/activity/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'activityLog')->name('admin.activity.update');
    Route::delete('/activity/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'activityLog')->name('admin.activity.destroy');

    Route::get('/content', fn () => redirect('/admin/content/news'))->name('admin.content');
    Route::get('/content/news', [AdminRecordCrudController::class, 'index'])->defaults('type', 'news')->defaults('section', 'Admin')->name('admin.content.news');
    Route::post('/content/news', [AdminRecordCrudController::class, 'store'])->defaults('type', 'news')->name('admin.content.news.store');
    Route::put('/content/news/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'news')->name('admin.content.news.update');
    Route::delete('/content/news/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'news')->name('admin.content.news.destroy');

    Route::get('/content/reflections', [AdminRecordCrudController::class, 'index'])->defaults('type', 'reflections')->defaults('section', 'Admin')->name('admin.content.reflections');
    Route::post('/content/reflections', [AdminRecordCrudController::class, 'store'])->defaults('type', 'reflections')->name('admin.content.reflections.store');
    Route::put('/content/reflections/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'reflections')->name('admin.content.reflections.update');
    Route::delete('/content/reflections/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'reflections')->name('admin.content.reflections.destroy');

    Route::get('/content/galleries', [AdminRecordCrudController::class, 'index'])->defaults('type', 'galleries')->defaults('section', 'Admin')->name('admin.content.galleries');
    Route::post('/content/galleries', [AdminRecordCrudController::class, 'store'])->defaults('type', 'galleries')->name('admin.content.galleries.store');
    Route::put('/content/galleries/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'galleries')->name('admin.content.galleries.update');
    Route::delete('/content/galleries/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'galleries')->name('admin.content.galleries.destroy');

    Route::get('/content/announcements', [AdminRecordCrudController::class, 'index'])->defaults('type', 'announcements')->defaults('section', 'Admin')->name('admin.content.announcements');
    Route::post('/content/announcements', [AdminRecordCrudController::class, 'store'])->defaults('type', 'announcements')->name('admin.content.announcements.store');
    Route::put('/content/announcements/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'announcements')->name('admin.content.announcements.update');
    Route::delete('/content/announcements/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'announcements')->name('admin.content.announcements.destroy');

    Route::get('/content/student-works', [AdminRecordCrudController::class, 'index'])->defaults('type', 'studentWorks')->defaults('section', 'Admin')->name('admin.content.student-works');
    Route::post('/content/student-works', [AdminRecordCrudController::class, 'store'])->defaults('type', 'studentWorks')->name('admin.content.student-works.store');
    Route::put('/content/student-works/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'studentWorks')->name('admin.content.student-works.update');
    Route::delete('/content/student-works/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'studentWorks')->name('admin.content.student-works.destroy');

    Route::get('/content/events', [AdminRecordCrudController::class, 'index'])->defaults('type', 'events')->defaults('section', 'Admin')->name('admin.content.events');
    Route::post('/content/events', [AdminRecordCrudController::class, 'store'])->defaults('type', 'events')->name('admin.content.events.store');
    Route::put('/content/events/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'events')->name('admin.content.events.update');
    Route::delete('/content/events/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'events')->name('admin.content.events.destroy');

    Route::get('/content/faqs', [AdminRecordCrudController::class, 'index'])->defaults('type', 'faqs')->defaults('section', 'Admin')->name('admin.content.faqs');
    Route::post('/content/faqs', [AdminRecordCrudController::class, 'store'])->defaults('type', 'faqs')->name('admin.content.faqs.store');
    Route::put('/content/faqs/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'faqs')->name('admin.content.faqs.update');
    Route::delete('/content/faqs/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'faqs')->name('admin.content.faqs.destroy');

    Route::get('/users', [AdminUsersController::class, 'index'])->name('admin.users');
    Route::post('/users', [AdminUsersController::class, 'store'])->name('admin.users.store');
    Route::put('/users/{user}', [AdminUsersController::class, 'update'])->name('admin.users.update');
    Route::delete('/users/{user}', [AdminUsersController::class, 'destroy'])->name('admin.users.destroy');

    Route::get('/report-cards', [AdminReportCardsController::class, 'index'])->name('admin.report-cards');
    Route::get('/settings', [AdminSettingsController::class, 'edit'])->name('admin.settings');
    Route::post('/settings', [AdminSettingsController::class, 'update'])->name('admin.settings.update');
});


Route::middleware(['auth', 'role:teacher'])->prefix('teacher')->group(function () {
    Route::get('/', fn () => view('dashboard.teacher.overview'))->name('teacher.home');

    Route::post('/records/{type}/upload', [AdminRecordCrudController::class, 'upload'])->name('teacher.records.upload');
    Route::post('/records/{type}', [AdminRecordCrudController::class, 'store'])->name('teacher.records.store');
    Route::put('/records/{type}/{record}', [AdminRecordCrudController::class, 'update'])->name('teacher.records.update');
    Route::delete('/records/{type}/{record}', [AdminRecordCrudController::class, 'destroy'])->name('teacher.records.destroy');
    Route::get('/classes', [AdminRecordCrudController::class, 'index'])->defaults('type', 'classes')->defaults('section', 'Guru')->defaults('routeBase', 'teacher.records')->name('teacher.classes');
    Route::post('/classes', [AdminRecordCrudController::class, 'store'])->defaults('type', 'classes')->name('teacher.classes.store');
    Route::put('/classes/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'classes')->name('teacher.classes.update');
    Route::delete('/classes/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'classes')->name('teacher.classes.destroy');

    Route::get('/scores', [AdminRecordCrudController::class, 'index'])->defaults('type', 'scores')->defaults('section', 'Guru')->defaults('routeBase', 'teacher.records')->name('teacher.scores');
    Route::post('/scores', [AdminRecordCrudController::class, 'store'])->defaults('type', 'scores')->name('teacher.scores.store');
    Route::put('/scores/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'scores')->name('teacher.scores.update');
    Route::delete('/scores/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'scores')->name('teacher.scores.destroy');

    Route::get('/evaluations', [AdminRecordCrudController::class, 'index'])->defaults('type', 'evaluations')->defaults('section', 'Guru')->defaults('routeBase', 'teacher.records')->name('teacher.evaluations');
    Route::post('/evaluations', [AdminRecordCrudController::class, 'store'])->defaults('type', 'evaluations')->name('teacher.evaluations.store');
    Route::put('/evaluations/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'evaluations')->name('teacher.evaluations.update');
    Route::delete('/evaluations/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'evaluations')->name('teacher.evaluations.destroy');

    Route::get('/modules', [AdminRecordCrudController::class, 'index'])->defaults('type', 'modules')->defaults('section', 'Guru')->defaults('routeBase', 'teacher.records')->name('teacher.modules');
    Route::post('/modules', [AdminRecordCrudController::class, 'store'])->defaults('type', 'modules')->name('teacher.modules.store');
    Route::put('/modules/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'modules')->name('teacher.modules.update');
    Route::delete('/modules/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'modules')->name('teacher.modules.destroy');

    Route::get('/submissions', [AdminRecordCrudController::class, 'index'])->defaults('type', 'approvalQueue')->defaults('section', 'Guru')->defaults('routeBase', 'teacher.records')->name('teacher.submissions');
    Route::post('/submissions', [AdminRecordCrudController::class, 'store'])->defaults('type', 'approvalQueue')->name('teacher.submissions.store');
    Route::put('/submissions/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'approvalQueue')->name('teacher.submissions.update');
    Route::delete('/submissions/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'approvalQueue')->name('teacher.submissions.destroy');

    Route::get('/profile', [DashboardProfileController::class, 'edit'])->defaults('section', 'Guru')->name('teacher.profile');
    Route::post('/profile', [DashboardProfileController::class, 'update'])->defaults('section', 'Guru')->name('teacher.profile.update');
});

Route::middleware(['auth', 'role:osis'])->prefix('osis')->group(function () {
    Route::get('/', fn () => view('dashboard.osis.overview'))->name('osis.home');

    Route::post('/records/{type}/upload', [AdminRecordCrudController::class, 'upload'])->name('osis.records.upload');
    Route::post('/records/{type}', [AdminRecordCrudController::class, 'store'])->name('osis.records.store');
    Route::put('/records/{type}/{record}', [AdminRecordCrudController::class, 'update'])->name('osis.records.update');
    Route::delete('/records/{type}/{record}', [AdminRecordCrudController::class, 'destroy'])->name('osis.records.destroy');
    Route::get('/extra', [AdminRecordCrudController::class, 'index'])->defaults('type', 'extracurriculars')->defaults('section', 'OSIS')->defaults('routeBase', 'osis.records')->name('osis.extra');
    Route::post('/extra', [AdminRecordCrudController::class, 'store'])->defaults('type', 'extracurriculars')->name('osis.extra.store');
    Route::put('/extra/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'extracurriculars')->name('osis.extra.update');
    Route::delete('/extra/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'extracurriculars')->name('osis.extra.destroy');

    Route::get('/works', [AdminRecordCrudController::class, 'index'])->defaults('type', 'studentWorks')->defaults('section', 'OSIS')->defaults('routeBase', 'osis.records')->name('osis.works');
    Route::post('/works', [AdminRecordCrudController::class, 'store'])->defaults('type', 'studentWorks')->name('osis.works.store');
    Route::put('/works/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'studentWorks')->name('osis.works.update');
    Route::delete('/works/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'studentWorks')->name('osis.works.destroy');

    Route::get('/events', [AdminRecordCrudController::class, 'index'])->defaults('type', 'events')->defaults('section', 'OSIS')->defaults('routeBase', 'osis.records')->name('osis.events');
    Route::post('/events', [AdminRecordCrudController::class, 'store'])->defaults('type', 'events')->name('osis.events.store');
    Route::put('/events/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'events')->name('osis.events.update');
    Route::delete('/events/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'events')->name('osis.events.destroy');

    Route::get('/gallery', [AdminRecordCrudController::class, 'index'])->defaults('type', 'galleries')->defaults('section', 'OSIS')->defaults('routeBase', 'osis.records')->name('osis.gallery');
    Route::post('/gallery', [AdminRecordCrudController::class, 'store'])->defaults('type', 'galleries')->name('osis.gallery.store');
    Route::put('/gallery/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'galleries')->name('osis.gallery.update');
    Route::delete('/gallery/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'galleries')->name('osis.gallery.destroy');

    Route::get('/announcements', [AdminRecordCrudController::class, 'index'])->defaults('type', 'announcements')->defaults('section', 'OSIS')->defaults('routeBase', 'osis.records')->name('osis.announcements');
    Route::post('/announcements', [AdminRecordCrudController::class, 'store'])->defaults('type', 'announcements')->name('osis.announcements.store');
    Route::put('/announcements/{record}', [AdminRecordCrudController::class, 'update'])->defaults('type', 'announcements')->name('osis.announcements.update');
    Route::delete('/announcements/{record}', [AdminRecordCrudController::class, 'destroy'])->defaults('type', 'announcements')->name('osis.announcements.destroy');

    Route::get('/profile', [DashboardProfileController::class, 'edit'])->defaults('section', 'OSIS')->name('osis.profile');
    Route::post('/profile', [DashboardProfileController::class, 'update'])->defaults('section', 'OSIS')->name('osis.profile.update');
});
