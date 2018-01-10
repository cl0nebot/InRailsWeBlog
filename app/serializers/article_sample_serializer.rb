# == Schema Information
#
# Table name: articles
#
#  id              :integer          not null, primary key
#  author_id       :integer          not null
#  visibility      :integer          default(0), not null
#  notation        :integer          default(0)
#  priority        :integer          default(0)
#  allow_comment   :boolean          default(TRUE), not null
#  private_content :boolean          default(FALSE), not null
#  link         :boolean          default(FALSE), not null
#  draft       :boolean          default(FALSE), not null
#  slug            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class ArticleSampleSerializer < ActiveModel::Serializer
  cache key: 'article_sample', expires_in: 12.hours

  attributes :id,
             :mode,
             :mode_translated,
             :title,
             :summary,
             :content,
             :draft,
             :visibility,
             :current_language,
             :updated_at,
             :link,
             :slug,
             :outdated_articles_count,
             :comments_count

  belongs_to :user, serializer: UserSampleSerializer
  has_many :tags, serializer: TagSampleSerializer

  def mode_translated
    object.mode_to_tr
  end

  def content
    object.summary_content unless instance_options[:strict]
  end

  def updated_at
    I18n.l(object.updated_at, format: :custom).mb_chars.downcase.to_s
  end

  include Rails.application.routes.url_helpers
  def link
    article_path(object)
  end
end
