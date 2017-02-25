# == Schema Information
#
# Table name: topics
#
#  id          :integer          not null, primary key
#  user_id     :integer          not null
#  name        :string           not null
#  description :text
#  color       :string
#  priority    :integer          default(0), not null
#  visibility  :integer          default(0), not null
#  archived    :boolean          default(FALSE), not null
#  accepted    :boolean          default(TRUE), not null
#  slug        :string
#  deleted_at  :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class TopicSerializer < ActiveModel::Serializer
  cache key: 'topic', expires_in: 12.hours

  attributes :id,
             :user_id,
             :name,
             :description,
             :priority,
             :visibility,
             :slug
end