# frozen_string_literal: true

Capybara.run_server = true

Capybara.app_host    = 'http://localhost:3020'
Capybara.server_host = 'localhost'
Capybara.server_port = '3020'
Capybara.configure do |config|
  config.default_host = 'http://localhost:3020'
end

# Full chrome version
Capybara.register_driver :selenium_chrome do |app|
  browser_options = ::Selenium::WebDriver::Chrome::Options.new
  browser_options.args << '--window-size=1920x1080'
  Capybara::Selenium::Driver.new(app, browser: :chrome, options: browser_options)
end

# Headless chrome version
Capybara.register_driver :selenium_chrome_headless do |app|
  browser_options = ::Selenium::WebDriver::Chrome::Options.new
  browser_options.args << '--headless'
  browser_options.args << '--window-size=1920x1080'
  Capybara::Selenium::Driver.new(app, browser: :chrome, options: browser_options)
end

Capybara.javascript_driver = :selenium_chrome_headless

Capybara.configure do |config|
  config.default_max_wait_time = 10 # seconds
end

# class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
#   driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
# end
