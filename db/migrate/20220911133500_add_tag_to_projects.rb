class AddTagToProjects < ActiveRecord::Migration[7.0]
  def change
    change_table :projects do |t|
      t.string :tag
    end
  end
end
