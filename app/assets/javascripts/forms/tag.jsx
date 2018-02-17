'use strict';

export const validateTag = (values) => {
    const errors = {};

    const name = values.get('name');
    if (name) {
        if (name.length < window.settings.tag_name_min_length || name.length > window.settings.tag_name_max_length) {
            errors.name = I18n.t('js.tag.errors.name.size', {
                min: window.settings.tag_name_min_length,
                max: window.settings.tag_name_max_length
            });
        }
    }

    const description = values.get('description');
    if (description) {
        if (description.length < window.settings.tag_description_min_length || description.length > window.settings.tag_description_max_length) {
            errors.description = I18n.t('js.tag.errors.description.size', {
                min: window.settings.tag_description_min_length,
                max: window.settings.tag_description_max_length
            });
        }
    }

    return errors;
};
