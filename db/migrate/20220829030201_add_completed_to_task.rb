class AddCompletedToTask < ActiveRecord::Migration[7.0]
  def change
    change_table :tasks do |t|
      t.remove :task_id
      t.boolean :completed
    end
  end
end
