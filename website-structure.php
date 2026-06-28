<?php

return [
    'goals' => [
        'lead_generation' => 'Mendapat pelanggan baru',
        'booking_inquiry' => 'Menerima booking / reservasi',
        'organization_branding' => 'Branding lembaga / organisasi',
        'catalog_showcase' => 'Menampilkan katalog',
        'community_growth' => 'Mengelola komunitas',
        'donation_sponsorship' => 'Mencari donatur / sponsorship',
    ],

    'website_types' => [
        'landing_page' => [
            'label' => 'Landing Page',
            'pages' => ['home'],
        ],
        'company_profile' => [
            'label' => 'Company Profile',
            'pages' => ['home', 'about', 'services', 'portfolio', 'articles', 'article_detail', 'contact'],
        ],
        'catalog_product' => [
            'label' => 'Katalog Produk / Layanan',
            'pages' => ['home', 'products', 'product_detail', 'articles', 'article_detail', 'contact'],
        ],
        'booking_inquiry' => [
            'label' => 'Booking / Inquiry',
            'pages' => ['home', 'packages', 'gallery', 'booking', 'articles', 'contact'],
        ],
        'community_website' => [
            'label' => 'Komunitas / Event',
            'pages' => ['home', 'events', 'gallery', 'articles', 'join'],
        ],
    ],

    'themes' => [
        'formal' => 'Formal',
        'casual' => 'Casual',
        'abstract' => 'Abstract',
    ],

    'pages' => [
        'home' => 'Home',
        'about' => 'About Us',
        'services' => 'Service',
        'portfolio' => 'Portfolio',
        'articles' => 'Blog / Artikel',
        'article_detail' => 'Article Detail',
        'contact' => 'Contact',
        'products' => 'Products',
        'product_detail' => 'Product Detail',
        'packages' => 'Rooms / Packages',
        'gallery' => 'Gallery',
        'booking' => 'Booking / Inquiry',
        'events' => 'Events',
        'join' => 'Join Community',
    ],

    'page_section_rules' => [
        'company_profile' => [
            'home' => ['hero', 'profile_summary', 'service_preview', 'portfolio_preview', 'trust_proof', 'cta_contact'],
            'about' => ['organization_profile', 'history_timeline', 'vision_mission', 'value_statement', 'team_highlight'],
            'services' => ['service_hero', 'service_grid', 'service_process', 'service_benefits', 'service_faq'],
            'portfolio' => ['portfolio_hero', 'portfolio_category', 'portfolio_grid', 'case_highlight', 'portfolio_cta'],
            'articles' => ['article_hero', 'featured_article', 'article_preview'],
            'article_detail' => ['article_detail_hero', 'article_content', 'related_articles', 'article_cta'],
            'contact' => ['contact_hero', 'contact_information', 'maps_location', 'contact_faq', 'contact_cta'],
        ],
        'catalog_product' => [
            'home' => ['hero', 'category_preview', 'featured_products', 'advantages', 'testimonials', 'whatsapp_cta'],
            'products' => ['product_hero', 'product_category_filter', 'product_grid', 'product_promo_highlight', 'faq', 'order_cta'],
            'product_detail' => ['product_detail_hero', 'product_specification', 'product_recommendation', 'product_order_cta'],
            'articles' => ['article_preview'],
            'article_detail' => ['article_detail_hero', 'article_content', 'related_articles', 'article_cta'],
            'contact' => ['contact_information', 'maps_location', 'contact_cta'],
        ],
        'booking_inquiry' => [
            'home' => ['hero_slider', 'package_grid', 'gallery_preview', 'facilities', 'testimonials', 'booking_cta'],
            'packages' => ['package_hero', 'package_grid', 'package_filter', 'booking_cta'],
            'gallery' => ['gallery_hero', 'gallery_grid', 'gallery_cta'],
            'booking' => ['booking_hero', 'booking_form', 'contact_info', 'whatsapp_cta'],
            'articles' => ['article_hero', 'article_list', 'article_cta'],
            'contact' => ['contact_hero', 'contact_form', 'maps', 'whatsapp_cta'],
        ],
        'community_website' => [
            'home' => ['hero', 'upcoming_events', 'member_benefits', 'gallery_preview', 'sponsors', 'join_cta'],
            'events' => ['events_hero', 'event_list', 'event_detail_preview', 'join_cta'],
            'gallery' => ['gallery_hero', 'gallery_grid', 'activity_highlight'],
            'articles' => ['article_hero', 'article_list', 'article_cta'],
            'join' => ['join_hero', 'join_form', 'member_benefits', 'whatsapp_cta'],
        ],
        'landing_page' => [
            'home' => ['hero', 'problem_solution', 'features', 'proof', 'faq', 'cta_contact'],
        ],
    ],
];
