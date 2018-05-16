# == Schema Information
#
# Table name: tag_relationships
#
#  id         :bigint(8)        not null, primary key
#  user_id    :bigint(8)        not null
#  topic_id   :bigint(8)        not null
#  article_id :bigint(8)        not null
#  parent_id  :bigint(8)        not null
#  child_id   :bigint(8)        not null
#  deleted_at :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do

  factory :tag_relationship do
    # user
    # topic

    # article

    # parent (tag)
    # child (tag)
  end

end
