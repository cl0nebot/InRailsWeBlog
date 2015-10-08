# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  pseudo                 :string           default(""), not null
#  first_name             :string           default("")
#  last_name              :string           default("")
#  age                    :integer          default(0)
#  city                   :string           default("")
#  country                :string           default("")
#  additional_info        :string           default("")
#  locale                 :string           default("fr")
#  slug                   :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#

FactoryGirl.define do |f|
  factory :user, aliases: [:author] do
    sequence(:pseudo)     { |n| "Person #{n}" }
    sequence(:email)      { |n| "person_#{n}@example.com"}
    password              'password'
    password_confirmation 'password'
    locale                'fr'
    first_name            'First name'
    last_name             'Last name'
    additional_info       'Personal information'
    age                   40
    city                  'City'
    country               'France'

    trait :confirmed do
      confirmed_at          { Time.zone.now }
      confirmation_token    { Devise.friendly_token }
      confirmation_sent_at  { Time.zone.now }
    end

    trait :faker do
      first_name      { Faker::Name.first_name }
      last_name       { Faker::Name.last_name }
      age             { Random.rand(20..80) }
      additional_info { Faker::Lorem.paragraph }
      city            { Faker::Address.city }
    end
  end
end