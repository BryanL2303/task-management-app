class AddTaskPriority < ActiveRecord::Migration[7.0]
  def change
    change_table :tasks do |t|
      t.integer :task_priority
    end
  end
end
