import assert from 'node:assert/strict';

export function productCopy(story, translations, locale) {
  assert.equal(story.hero.name, 'Stack');
  assert.equal(story.features.length, 3);
  assert.deepEqual(Object.keys(translations).sort(), ['ja', 'ko', 'zh']);
  assert.ok(['en', 'ja', 'zh', 'ko'].includes(locale), `Unknown product locale: ${locale}`);
  const ids = story.features.map(feature => feature.id);
  assert.equal(new Set(ids).size, 3);
  for (const translation of Object.values(translations)) {
    assert.deepEqual(Object.keys(translation.features).sort(), [...ids].sort(), 'Translated benefit inventory drift');
    for (const key of ['tagline', 'description', 'primaryActionText', 'secondaryActionText', 'logoAlt']) {
      assert.ok(typeof translation.hero[key] === 'string' && translation.hero[key].trim().length > 0, `Missing translated hero ${key}`);
    }
    for (const feature of Object.values(translation.features)) {
      for (const key of ['title', 'details']) assert.ok(typeof feature[key] === 'string' && feature[key].trim().length > 0, `Missing translated benefit ${key}`);
    }
  }
  const translated = locale === 'en' ? null : translations[locale];
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return {
    description: translated?.hero.description ?? story.hero.description,
    hero: {
      name: story.hero.name,
      tagline: translated?.hero.tagline ?? story.hero.tagline,
      image: { light: '/favicon.svg', dark: '/favicon.svg', alt: translated?.hero.logoAlt ?? 'Stack logo' },
      actions: [
        { theme: 'brand', text: translated?.hero.primaryActionText ?? story.hero.primaryAction.text, link: prefix + story.hero.primaryAction.link },
        { theme: 'alt', text: translated?.hero.secondaryActionText ?? story.hero.secondaryAction.text, link: story.hero.secondaryAction.link },
      ],
    },
    features: story.features.map(feature => ({
      title: translated?.features[feature.id].title ?? feature.title,
      details: translated?.features[feature.id].details ?? feature.details,
    })),
  };
}

export function productTokens(copy) {
  return {
    // JSON is valid YAML, so punctuation and translated strings remain escaped safely.
    productHome: Object.entries(copy).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n'),
    productBenefits: copy.features.map(feature => `- **${feature.title}:** ${feature.details}`).join('\n'),
  };
}
