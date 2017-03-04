class CreateArticles < ActiveRecord::Migration[5.0]
  def change
    create_table :articles do |t|
      t.belongs_to  :user,    foreign_key: true, null: true,  index: false
      t.belongs_to  :topic,   foreign_key: true, null: true,  index: false

      t.string      :title
      t.text        :summary
      t.text        :content,         null: false
      t.text        :reference
      t.boolean     :draft,       null: false,    default: false
      t.string      :language
      t.integer     :notation,                        default: 0
      t.integer     :priority,                        default: 0

      t.boolean     :allow_comment,   null: false,    default: true
      t.integer     :visibility,      null: false,    default: 0
      t.boolean     :accepted,        null: false,    default: true
      t.boolean     :archived,        null: false,    default: false

      t.integer     :pictures_count,                  default: 0
      t.integer     :outdated_articles_count,         default: 0
      t.integer     :bookmarks_count,                 default: 0
      t.integer     :comments_count,                  default: 0

      t.string      :slug

      t.datetime    :deleted_at,      index: true

      t.timestamps
    end

    add_index :articles, [:user_id,   :visibility],  where: 'deleted_at IS NULL'
    add_index :articles, [:topic_id,  :visibility],  where: 'deleted_at IS NULL'
    add_index :articles, :slug,                      where: 'deleted_at IS NULL', unique: true
  end
end
