# Use this setup block to configure all options available in SimpleForm.
SimpleForm.setup do |config|
  config.error_notification_class = 'form-error'
  # config.button_class = 'waves-effect waves-light btn'
  config.boolean_label_class = nil

  config.wrappers :materialize_input, tag: 'div', class: 'input-field col s12', error_class: 'has-error' do |b|
    b.use :html5
    b.use :placeholder
    b.optional :maxlength
    b.optional :pattern
    b.optional :min_max
    b.optional :readonly

    b.use :icon
    b.use :input, class: 'validate'
    b.use :label
    b.use :error, wrap_with: { tag: 'span', class: 'field-error' }
    b.use :hint,  wrap_with: { tag: 'span', class: 'help-block' }
  end

  config.wrappers :materialize_date, tag: 'div', class: 'col s12', error_class: 'has-error' do |b|
    b.use :html5
    b.use :placeholder
    b.optional :pattern
    b.optional :readonly

    b.use :icon
    b.use :label
    b.use :input, class: 'validate'
    b.use :error, wrap_with: { tag: 'span', class: 'field-error' }
    b.use :hint,  wrap_with: { tag: 'span', class: 'help-block' }
  end

  config.wrappers :materialize_checkbox, tag: 'p', error_class: 'has-error' do |b|
    b.use :html5
    b.optional :readonly

    b.use :input, type: 'checkbox', class: 'filled-in', value: true
    b.use :label
    b.use :error, wrap_with: { tag: 'span', class: 'form-error' }
    b.use :hint, wrap_with: { tag: 'p', class: 'help-block' }
  end

  config.wrappers :materialize_radio_buttons, tag: 'p', error_class: 'has-error' do |b|
    b.use :html5
    b.optional :readonly

    b.use :input, type: 'radio', class: 'with-gap', value: true
    b.use :label
    b.use :error, wrap_with: { tag: 'span', class: 'form-error' }
    b.use :hint, wrap_with: { tag: 'p', class: 'help-block' }
  end

  config.wrappers :materialize_select, tag: 'div', class: 'input-field col s12', error_class: 'has-error' do |b|
    b.use :html5
    b.optional :readonly

    b.use :input
    b.use :label
    b.use :error, wrap_with: { tag: 'span', class: 'form-error' }
    b.use :hint, wrap_with: { tag: 'p', class: 'help-block' }
  end

  config.wrappers :materialize_textarea, tag: 'div', class: 'input-field col s12', error_class: 'has-error' do |b|
    b.use :html5
    b.use :placeholder
    b.optional :maxlength
    b.optional :pattern
    b.optional :min_max
    b.optional :readonly

    b.use :input, class: 'materialize-textarea'
    b.use :label
    b.use :error, wrap_with: { tag: 'span', class: 'form-error' }
    b.use :hint, wrap_with: { tag: 'p', class: 'help-block' }
  end

  config.wrappers :materialize_file_input, tag: 'div', class: 'file-field input-field col s12', error_class: 'has-error' do |b|
    b.use :html5
    b.use :placeholder
    b.optional :readonly

    b.wrapper tag: 'div', class: 'btn' do |ba|
      ba.use :file_label
      ba.use :input
    end
    b.use :file_field

    b.use :error, wrap_with: { tag: 'span', class: 'form-error' }
    b.use :hint, wrap_with: { tag: 'p', class: 'help-block' }
  end

  config.default_wrapper = :materialize_input
  config.wrapper_mappings = {
    # check_boxes: :materialize_checkboxes,
    # radio_buttons: :materialize_radio_buttons,
    # file: :materialize_file_input,
    # boolean: :materialize_boolean,
  }
end

module SimpleForm
  module Components
    module Icons

      def icon(_wrapper_options)
        template.content_tag(:i, options[:icon], class: 'material-icons prefix') unless options[:icon].nil?
      end

      def file_label(_wrapper_options)
        template.content_tag(:span, options[:file_label]) unless options[:file_label].nil?
      end

      def file_field(_wrapper_options)
        template.content_tag(:div, class: 'file-path-wrapper') do
          template.concat template.content_tag(:input, nil, type: :text, class: 'file-path validate', placeholder: options[:file_field_label])
        end
      end

    end
  end
end

SimpleForm::Inputs::Base.send(:include, SimpleForm::Components::Icons)
