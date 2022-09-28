class AddCalenderTagToTask < ActiveRecord::Migration[7.0]
  def change
    change_table :tasks do |t|
      t.boolean :calender
    end
  end
end
