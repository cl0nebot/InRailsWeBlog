require 'sidekiq/web'
require 'sidekiq/cron/web'

Rails.application.routes.draw do
  # Root path
  root 'static_pages#home'

  # Concerns
  concern :tracker do |options|
    post    :clicked,   to: "#{options[:module].to_s}#clicked"
    post    :viewed,    to: "#{options[:module].to_s}#viewed"
  end

  concern :outdated do |options|
    resource :outdated, controller: 'outdated', only: [:create, :destroy], **options
  end

  concern :votes do |options|
    resource :votes, controller: 'votes', only: [:create, :destroy], **options
  end

  concern :comments do |options|
    get     :comments,  to: "#{options[:module].to_s}#comments"
    post    :comments,  to: "#{options[:module].to_s}#add_comment"
    put     :comments,  to: "#{options[:module].to_s}#update_comment"
    delete  :comments,  to: "#{options[:module].to_s}#remove_comment"
  end

  # Users (devise)
  devise_scope :user do
    get     'signup', to: 'users/registrations#new',    as: :signup
    post    'signup', to: 'users/registrations#create'
    get     'login',  to: 'users/sessions#new',         as: :login
    post    'login',  to: 'users/sessions#create'
    delete  'logout', to: 'users/sessions#destroy',     as: :logout
  end
  devise_for :users, controllers: { registrations:  'users/registrations',
                                    sessions:       'users/sessions',
                                    passwords:      'users/passwords' }

  # Users
  resources :users, except: [:new, :create, :destroy] do
    collection do
      get :validation,        to: 'users#validation'
    end

    member do
      get      :show,          to: 'users#show',               as: :root

      get      :draft,         to: 'users#draft',              as: :draft
      get      :bookmarks,     to: 'users#bookmarks',          as: :bookmarks
      get      :comments,      to: 'users#comments',           as: :comments
      get      :activities,    to: 'users#activities',         as: :activities

      concerns :tracker,       module: :users
    end

    # TODO: use scope instead of users/
    resources :topics,        controller: 'users/topics',     only: [:index, :create, :update, :destroy] do
      collection do
        post :switch,          to: 'users/topics#switch'
      end
    end

    resources :bookmarks,     controller: 'users/bookmarks',  only: [:create, :destroy]

    resources :settings,      controller: 'users/settings',   only: [:index] do
      collection do
        post :update,         to: 'users/settings#update'
      end
    end
  end

  # Users (activities)
  resources :activities, only: [:index]

  # Articles
  resources :articles do
    member do
      get      :history,   to: 'articles#history'
      get      :restore,   to: 'articles#restore'
      post     :bookmark,  to: 'articles#add_bookmark'
      delete   :bookmark,  to: 'articles#remove_bookmark'

      concerns :tracker,   module: :articles

      concerns :comments,  module: :articles
    end

    concerns :outdated,    module: :articles

    concerns :votes,       module: :articles
  end

  # Tags
  resources :tags, except: [:new, :create, :edit] do
    member do
      concerns :tracker,   module: :tags

      concerns :comments,  module: :tags
    end
  end

  # Global search
  resources :search, only: [:index] do
    collection do
      get :autocomplete,   to: 'search#autocomplete'
    end
  end

  resources :comments, only: [:index]

  # Static pages
  get :terms_of_use,  to: 'static_pages#terms_of_use'

  # Routes managed by javascript router
  get '/user/*id',      to: 'static_pages#home'
  get '/topic/*id',     to: 'static_pages#home'
  get '/tag/*id',       to: 'static_pages#home'
  get '/article/*id',   to: 'static_pages#home'

  # Errors
  %w( 404 422 500 ).each do |code|
    get code, to: 'errors#show', code: code
  end

  resources :errors, only: [ :index, :show, :create, :destroy ] do
    collection do
      post 'delete_all',     to: 'errors#destroy_all'
    end
  end

  # Admins
  devise_scope :admin do
    get     '/admin/login',  to: 'users/sessions#new',      as: :login_admin
    post    '/admin/login',  to: 'users/sessions#create'
    delete  '/admin/logout', to: 'users/sessions#destroy',  as: :logout_admin
  end
  devise_for :admins, controllers: {  sessions: 'users/sessions',
                                      passwords: 'users/passwords' }

  # Admin interface
  authenticate :admin do
    # Sidekiq interface
    mount Sidekiq::Web => '/admin/sidekiq'
  end

  # resources :admins
  get :admin,             to: 'admins#index'

  namespace :admin do
    # resources :managers, only: [] do
    #   collection do
    #     get     :pending_validation,        to: 'managers#pending_validation'
    #     get     :pending_comment_deletion,  to: 'managers#pending_comment_deletion'
    #
    #     get     :users,           to: 'managers#users'
    #     get     ':show_user/:user_id', to: 'managers#show_user'
    #
    #     get     :logs,            to: 'managers#logs'
    #
    #     get     :server,          to: 'managers#server'
    #
    #     get     :errors,          to: 'managers#errors'
    #   end
    # end
  end


end
