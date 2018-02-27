class UserSampleSerializer < ActiveModel::Serializer
  cache key: 'user_strict', expires_in: 12.hours

  attributes :id,
             :pseudo,
             :date,
             :avatar_url,
             :slug

  def id
    object.id
  end

  def pseudo
    object.pseudo
  end

  def date
    object.created_at.to_i
  end

  def avatar_url
    object.avatar_url
  end

  def slug
    object.slug
  end
end