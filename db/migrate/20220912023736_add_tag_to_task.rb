class AddTagToTask < ActiveRecord::Migration[7.0]
  def change
    change_table :tasks do |t|
      t.string :tag
    end
  end
end
