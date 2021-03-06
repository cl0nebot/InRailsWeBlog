# frozen_string_literal: true

require_relative 'boot'

# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_mailer/railtie'
# require 'action_cable/engine'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

# preload tokens in application.yml to local ENV unless variables are already defined (by Gitlab runner for instance)
unless ENV['WEBSITE_NAME']
  config = YAML.safe_load(File.read(File.expand_path('../application.yml', __FILE__)))
  config.merge! config.fetch(Rails.env, {})
  config.each do |key, value|
    ENV[key] = value.to_s unless value.is_a? Hash
  end
end

module InRailsWeBlog
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    config.generators do |generator|
      generator.test_framework :rspec,
                               fixtures: true,
                               view_specs: false,
                               helper_specs: false,
                               routing_specs: false,
                               controller_specs: true,
                               request_specs: true
      generator.fixture_replacement :factory_bot, dir: 'spec/factories'
      generator.assets false
    end

    # Load files from lib directory
    config.enable_dependency_loading = true
    config.autoload_paths += Dir["#{config.root}/app/services/**/"]
    config.autoload_paths += Dir["#{config.root}/lib/inrailsweblog/**/"]
    config.autoload_paths += Dir["#{config.root}/lib/populate/**/"]

    # Database time zone
    config.time_zone = 'Paris'
    config.active_record.default_timezone = :local

    # Include the authenticity token in remote forms.
    config.action_view.embed_authenticity_token_in_remote_forms = true

    # Log levels :debug, :info, :warn, :error, :fatal and :unknown
    config.log_level = :info

    # I18n configuration
    config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{ rb , yml }').to_s]
    config.i18n.default_locale = :fr
    config.i18n.fallbacks = [I18n.default_locale]

    # Enable per-form CSRF tokens. Previous versions had false.
    config.action_controller.per_form_csrf_tokens = false

    # Enable origin-checking CSRF mitigation. Previous versions had false.
    config.action_controller.forgery_protection_origin_check = true

    # Make Active Record use stable #cache_key alongside new #cache_version method.
    # This is needed for recyclable cache keys.
    config.active_record.cache_versioning = true

    # Use AES-256-GCM authenticated encryption for encrypted cookies.
    # Also, embed cookie expiry in signed or encrypted cookies for increased security.
    #
    # This option is not backwards compatible with earlier Rails versions.
    # It's best enabled when your entire app is migrated and stable on 5.2.
    #
    # Existing cookies will be converted on read then written with the new scheme.
    config.action_dispatch.use_authenticated_cookie_encryption = true

    # Use AES-256-GCM authenticated encryption as default cipher for encrypting messages
    # instead of AES-256-CBC, when use_authenticated_message_encryption is set to true.
    config.active_support.use_authenticated_message_encryption = true

    # Add default protection from forgery to ActionController::Base instead of in
    # ApplicationController.
    config.action_controller.default_protect_from_forgery = true

    # Use SHA-1 instead of MD5 to generate non-sensitive digests, such as the ETag header.
    config.active_support.use_sha1_digests = true

    # Use sidekiq for ActiveJob (not working with letter_opener)
    config.active_job.queue_adapter = :sidekiq

    # Cache with Redis
    config.cache_store = :readthis_store, {
      expires_in: 2.weeks.to_i,
      redis: { url: "redis://#{ENV['REDIS_HOST']}:#{ENV['REDIS_PORT']}", driver: :hiredis },
      namespace: "_#{ENV['WEBSITE_NAME']}_#{Rails.env}:cache"
    }

    # Errors handling
    config.exceptions_app = self.routes

    # Custom configuration
    config.x.cron_jobs_active = true
  end
end
