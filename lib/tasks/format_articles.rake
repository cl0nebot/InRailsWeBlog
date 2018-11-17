# frozen_string_literal: true

namespace :InRailsWeBlog do

  # Example:
  # rails InRailsWeBlog:format_articles
  desc 'Format articles content'
  task :format_articles, [] => :environment do |_task, _args|
    Rails.logger = ActiveRecord::Base.logger = Logger.new(STDOUT)
    Rails.logger.warn("#{Time.now} : Format articles task")

    Article.all.find_in_batches(batch_size: 200) do |articles|
      articles.each do |article|
        article.content = ::Sanitizer.new.sanitize_html(article.content)
        article.save!
      end
    end
  end
end
