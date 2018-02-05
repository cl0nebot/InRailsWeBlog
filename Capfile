# Load DSL and Setup Up Stages
require 'capistrano/setup'

# Includes default deployment tasks
require 'capistrano/deploy'

# Includes tasks from other gems included in your Gemfile
require 'capistrano/scm/git'
require 'capistrano/rvm'
require 'capistrano/bundler'
require 'capistrano/rails/migrations'
require 'capistrano-db-tasks'
require 'capistrano/sidekiq'
require 'capistrano/rails/console'
require 'capistrano/passenger'
require 'whenever/capistrano'

# SCM
install_plugin Capistrano::SCM::Git

# Loads custom tasks from `lib/capistrano/tasks' if you have any defined.
Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
