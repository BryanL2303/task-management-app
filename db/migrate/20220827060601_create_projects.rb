class CreateProjects < ActiveRecord::Migration[7.0]
  def change
    create_table :projects do |t|
      t.integer :project_id
      t.string :project_name
      t.string :project_description, null:true

      t.timestamps
    end
  end
end
