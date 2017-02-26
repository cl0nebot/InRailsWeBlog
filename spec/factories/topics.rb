# == Schema Information
#
# Table name: topics
#
#  id              :integer          not null, primary key
#  user_id         :integer
#  name            :string           not null
#  description     :text
#  color           :string
#  priority        :integer          default(0), not null
#  visibility      :integer          default(0), not null
#  accepted        :boolean          default(TRUE), not null
#  archived        :boolean          default(FALSE), not null
#  pictures_count  :integer          default(0)
#  articles_count  :integer          default(0)
#  bookmarks_count :integer          default(0)
#  slug            :string
#  deleted_at      :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

FactoryGirl.define do

  factory :topic do
    # user

    sequence(:name)         { |n| "Topic #{n}" }
    sequence(:description)  { |n| "Topic description #{n}" }
    priority                0
    visibility              'everyone'
    accepted                true
  end

end
