# frozen_string_literal: true

# == Schema Information
#
# Table name: bookmarks
#
#  id              :bigint(8)        not null, primary key
#  user_id         :bigint(8)        not null
#  bookmarked_type :string           not null
#  bookmarked_id   :bigint(8)        not null
#  follow          :boolean          default(FALSE)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  topic_id        :bigint(8)
#

class BookmarkSerializer < ActiveModel::Serializer
  cache key: 'bookmark', expires_in: CONFIG.cache_time

  attributes :id,
             :user_id,
             :bookmarked_id,
             :bookmarked_type,
             :follow,
             :name,
             :parent_slug,
             :slug

  def name
    object.bookmarked.title
  end

  def parent_slug
    if object.bookmarked.respond_to?(:user)
      object.bookmarked.user.slug
    end
  end

  def slug
    object.bookmarked.slug
  end
end
