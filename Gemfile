source 'https://rubygems.org'

ruby '2.2.3'

gem 'rails',                    '4.2.4'

# Use postgresql as the database for Active Record
gem 'pg',                       '~> 0.18.3'

# Responders format
gem 'responders',               '~> 2.1.0'

# JSON
gem 'jbuilder',                 '~> 2.3.1'

# Use slim instead of erb
gem 'slim-rails',               '~> 3.0.1'

# Internationalization
gem 'http_accept_language',     '~> 2.0.2'
gem 'globalize',                '~> 5.0.1'
# 3.0.0.rc11 bugged, generate translations twice in the same file
gem 'i18n-js',                  '= 3.0.0.rc9'

# Run asynschronous process
gem 'sidekiq',                  '~> 3.5.0'
gem 'sinatra',                  '~> 1.4.5',     require: false
gem 'whenever',                 '~> 0.9.4',     require: false

# Redis session store
gem 'redis-session-store',      '~> 0.8.0'

# Deployment
gem 'capistrano',               '~> 3.4.0'
gem 'capistrano-rails',         '~> 1.1.3'
gem 'rvm1-capistrano3',         '~> 1.3.2.2', require: false
gem 'capistrano-bundler',       '~> 1.1.4',   require: false
gem 'capistrano-rails-console', '~> 1.0.0',   require: false
gem 'capistrano-db-tasks',      '~> 0.4',     require: false
gem 'capistrano-sidekiq',       '~> 0.5.3',   require: false

group :development do
  # server
  gem 'thin', '~> 1.6.3'

  # Debugging tool
  gem 'pry-rails',              '~> 0.3.3'
  gem 'awesome_print',          '~> 1.6.1'

  # Improve errors
  gem 'better_errors',          '~> 2.1.1'
  gem 'binding_of_caller',      '~> 0.7.2'

  # Turn off unnecessary log output
  gem 'quiet_assets',           '~> 1.1.0'

  # Guard and its minions
  gem 'guard',                  '~> 2.13.0'
  gem 'guard-rails',            '~> 0.7.2'
  gem 'guard-annotate',         '~> 2.2'
  gem 'guard-bundler',          '~> 2.1.0'
  gem 'guard-migrate',          '~> 1.2.1'
  gem 'guard-rake',             '~> 1.0.0'
  gem 'guard-rspec',            '~> 4.6.4',  require: false
  gem 'guard-sidekiq',          '~> 0.1.0'
  gem 'guard-process',          '~> 1.2.1'
  gem 'libnotify',              '~> 0.9.1'
end

group :test do
  # Test tools
  gem 'rspec-rails',            '~> 3.3.3'
  gem 'capybara',               '~> 2.5.0'
  gem 'capybara-email',         '~> 2.4.0'
  gem 'capybara-webkit',        '~> 1.7.0'
  gem 'capybara-screenshot',    '~> 1.0.11'
  gem 'launchy',                '~> 2.4.3'
  gem 'shoulda-matchers',       '~> 2.8.0',   require: false
  gem 'html_validation',        '~> 1.1.3'
  gem 'spork',                  '~> 0.9.2'
  gem 'simplecov',              '~> 0.10.0',  require: false
  gem 'fuubar',                 '~> 2.0.0'
  gem 'database_cleaner',       '~> 1.5.0'
  gem 'spring-commands-rspec',  '~> 1.0.4'

  # Dummy data
  gem 'factory_girl_rails',     '~> 4.5.0'
  gem 'faker',                  '~> 1.5.0'

  # static analyzer
  gem 'rubocop',                '~> 0.34.1',  require: false
  gem 'rails_best_practices',   '~> 1.15.7',  require: false
  gem 'brakeman',               '~> 3.0.5',   require: false
  gem 'metric_fu',              '~> 4.12.0',  require: false
  gem 'i18n-tasks',             '~> 0.8.6',   require: false
  gem 'deadweight',             '~> 0.2.2',   require: false
end

group :development, :test do
  # Speed up server and tests
  gem 'spring',   '~> 1.4.0'
end

group :production do
  # server
  gem 'passenger', '~> 5.0.18'
end
