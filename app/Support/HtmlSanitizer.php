<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use DOMNode;

class HtmlSanitizer
{
    public static function sanitize(?string $html): string
    {
        $html = (string) $html;
        if (trim($html) == '') {
            return '';
        }

        $allowedTags = [
            'a',
            'b',
            'blockquote',
            'br',
            'code',
            'div',
            'em',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'hr',
            'i',
            'img',
            'li',
            'ol',
            'p',
            'pre',
            'span',
            'strong',
            'u',
            'ul',
        ];

        $allowedAttrs = [
            'a' => ['href', 'target', 'rel', 'title'],
            'img' => ['src', 'alt', 'title'],
            '*' => ['class'],
        ];

        $doc = new DOMDocument();
        libxml_use_internal_errors(true);
        $wrapped = '<div>' . $html . '</div>';
        $doc->loadHTML($wrapped, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        libxml_clear_errors();

        $root = $doc->documentElement;
        if (!$root) {
            return '';
        }

        self::sanitizeNode($root, $allowedTags, $allowedAttrs);

        $out = '';
        foreach ($root->childNodes as $child) {
            $out .= $doc->saveHTML($child);
        }
        return $out;
    }

    /**
     * @param array<int, string> $allowedTags
     * @param array<string, array<int, string>> $allowedAttrs
     */
    private static function sanitizeNode(DOMNode $node, array $allowedTags, array $allowedAttrs): void
    {
        if ($node->hasChildNodes()) {
            for ($i = $node->childNodes->length - 1; $i >= 0; $i--) {
                $child = $node->childNodes->item($i);
                if ($child) {
                    self::sanitizeNode($child, $allowedTags, $allowedAttrs);
                }
            }
        }

        if (!($node instanceof DOMElement)) {
            return;
        }

        $tag = strtolower($node->tagName);

        if (!in_array($tag, $allowedTags, true)) {
            $parent = $node->parentNode;
            if (!$parent) {
                $node->parentNode?->removeChild($node);
                return;
            }
            while ($node->firstChild) {
                $parent->insertBefore($node->firstChild, $node);
            }
            $parent->removeChild($node);
            return;
        }

        $allowed = array_merge($allowedAttrs['*'] ?? [], $allowedAttrs[$tag] ?? []);
        if ($node->hasAttributes()) {
            for ($i = $node->attributes->length - 1; $i >= 0; $i--) {
                $attr = $node->attributes->item($i);
                if (!$attr) {
                    continue;
                }
                $name = strtolower($attr->name);
                $value = (string) $attr->value;

                if (str_starts_with($name, 'on')) {
                    $node->removeAttributeNode($attr);
                    continue;
                }

                if (!in_array($name, $allowed, true)) {
                    $node->removeAttributeNode($attr);
                    continue;
                }

                if (($tag === 'a' && $name === 'href') || ($tag === 'img' && $name === 'src')) {
                    if (!self::isSafeUrl($value)) {
                        $node->removeAttributeNode($attr);
                    }
                }

                if ($tag === 'a' && $name === 'target') {
                    if (!in_array($value, ['_blank', '_self'], true)) {
                        $node->removeAttributeNode($attr);
                    }
                }
            }
        }

        if ($tag === 'a') {
            $href = strtolower((string) $node->getAttribute('href'));
            if ($href !== '' && $node->getAttribute('target') === '_blank') {
                $node->setAttribute('rel', 'noreferrer noopener');
            }
        }
    }

    private static function isSafeUrl(string $url): bool
    {
        $u = trim($url);
        if ($u === '') {
            return false;
        }
        if (preg_match('/^javascript:/i', $u)) {
            return false;
        }
        if (preg_match('/^data:/i', $u)) {
            return false;
        }
        if (preg_match('/^https?:\/\//i', $u)) {
            return true;
        }
        if (str_starts_with($u, '/')) {
            return true;
        }
        return false;
    }
}

