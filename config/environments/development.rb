Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes               = false

  # Do not eager load code on boot.
  config.eager_load                  = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local = true

  # Enable/disable caching. By default caching is disabled.
  if Rails.root.join('tmp/caching-dev.txt').exist?
    config.action_controller.perform_caching = true
  else
    config.cache_store = :null_store
    config.action_controller.perform_caching = false
  end

  config.action_mailer.perform_caching = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation          = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error       = :page_load

  # Raises error for missing translations
  config.action_view.raise_on_missing_translations = true

  # Raise warning when loading large data set
  config.active_record.warn_on_records_fetched_greater_than = 500

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  # config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  # Mails
  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  config.action_mailer.default_url_options   = { host: ENV['WEBSITE_ADDRESS'] } # Use by devise for sending emails. Change to definitive name
  config.action_mailer.delivery_method       = :smtp
  config.action_mailer.perform_deliveries    = false
  config.action_mailer.raise_delivery_errors = false
  config.action_mailer.default charset: 'utf-8'

  # "pretty" HTML format output
  Slim::Engine.set_options pretty: true

  # N 1 Queries
  config.after_initialize do
    Bullet.enable               = true
    Bullet.alert                = false
    Bullet.bullet_logger        = false
    Bullet.console              = false
    Bullet.rails_logger         = true
    Bullet.add_footer           = false
    Bullet.counter_cache_enable = true
  end
end
