Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.cache_classes = true

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # # Attempt to read encrypted secrets from `config/secrets.yml.enc`.
  # # Requires an encryption key in `ENV["RAILS_MASTER_KEY"]` or
  # # `config/secrets.yml.key`.
  # config.read_encrypted_secrets = true

  # Disable serving static files from the `/public` folder by default since
  # Apache or NGINX already handles this.
  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = 'X-Sendfile' # for Apache
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for NGINX

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true

  # Prevent host header injection
  config.action_controller.default_url_options = { host: ENV['WEBSITE_ADDRESS'] }
  config.action_controller.asset_host          = ENV['WEBSITE_ADDRESS']

  # Use the lowest log level to ensure availability of diagnostic information
  # when problems arise.
  config.log_level = :info

  # Prepend all log lines with the following tags.
  # config.log_tags = [ :subdomain, :uuid ]
  config.log_tags = [:request_id]

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners.
  config.active_support.deprecation = :notify

  # Use default logging formatter so that PID and timestamp are not suppressed.
  config.log_formatter          = ::Logger::Formatter.new
  config.lograge.enabled        = true
  config.lograge.custom_options = lambda do |event|
    options          = event.payload.slice(:request_id, :user_id, :admin_id)
    options[:params] = event.payload[:params].except('controller', 'action')
    options[:search] = event.payload[:searchkick_runtime] if event.payload[:searchkick_runtime].to_f > 0
    options
  end

  if ENV['RAILS_LOG_TO_STDOUT'].present?
    logger           = ActiveSupport::Logger.new(STDOUT)
    logger.formatter = config.log_formatter
    config.logger    = ActiveSupport::TaggedLogging.new(logger)
  end

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Mails
  config.action_mailer.default_url_options   = { host: ENV['WEBSITE_ADDRESS'] }
  config.action_mailer.delivery_method       = :smtp
  config.action_mailer.perform_deliveries    = true
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default charset: 'utf-8'
  config.action_mailer.smtp_settings = {
    ssl:                 true,
    address:             ENV['SMTP_HOST'],
    port:                ENV['SMTP_PORT'],
    domain:              ENV['WEBSITE_ADDRESS'],
    authentication:      'login',
    user_name:           ENV['EMAIL_USER'],
    password:            ENV['EMAIL_PASSWORD'],
    openssl_verify_mode: 'none'
  }
end
