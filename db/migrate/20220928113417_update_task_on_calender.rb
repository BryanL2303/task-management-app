class UpdateTaskOnCalender < ActiveRecord::Migration[7.0]
  def change
    change_table :tasks do |t|
      t.boolean :on_calender
      t.remove :calender
    end
  end
end
