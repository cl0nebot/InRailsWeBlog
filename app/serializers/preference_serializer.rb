# == Schema Information
#
# Table name: settings
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  name       :string           not null
#  value      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class settingserializer < ActiveModel::Serializer
  cache key: 'preference', expires_in: 12.hours

  attributes :article_display,
             :search_operator,
             :search_exact,
             :search_highlight

  def article_display
    object.settings[:article_display]
  end

  def search_operator
    object.settings[:search_operator]
  end

  def search_exact
    object.settings[:search_exact]
  end

  def search_highlight
    object.settings[:search_highlight]
  end
end
