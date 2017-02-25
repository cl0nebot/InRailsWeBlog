class CreateArticleRelationships < ActiveRecord::Migration[5.0]
  def change
    create_table :article_relationships do |t|
      t.belongs_to  :user,    null: true,  index: false

      t.belongs_to  :parent, null: false, index: false
      t.belongs_to  :child,  null: false, index: false

      t.timestamps
    end

    add_index :article_relationships, :user_id
    add_index :article_relationships, [:user_id, :parent_id, :child_id], unique: true
  end
end