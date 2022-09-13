class CreateTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks do |t|
      t.integer :task_id
      t.string :task_name
      t.string :task_description, optional: true, null: true
      t.time :time, optional: true, null: true
      t.boolean :scheduled
      t.belongs_to :calender, optional: true, null: true
      t.belongs_to :project, optional: true, null: true 

      t.timestamps
    end
  end
end
