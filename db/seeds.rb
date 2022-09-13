# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
Task.destroy_all
Calender.destroy_all
Project.destroy_all

calender = Calender.create!([{date: Date.new(2022, 8, 28)}, {date: Date.new(2022, 8, 29)}, {date: Date.new(2022, 8, 30)}, {date: Date.new(2022, 8, 31)}, {date: Date.new(2022, 9, 2)}])

tasks = Task.create!([{task_name: 'Programming', task_description: '1. Complete this dashboard 2. Think about whats next', time: Time.utc(2022, 8, 29, 8, 0, 0), completed:false, scheduled: true, calender:Calender.find_by(date: '"' + "2022-8-29" + '"')},
{task_name: 'Lunch', task_description: '1. Complete this dashboard 2. Think about whats next', time: Time.utc(2022, 8, 29, 10, 0, 0), completed:false, scheduled: true, calender:Calender.find_by(date: '"' + "2022-8-29" + '"')},
{task_name: 'Sleep', completed:false, scheduled: false},
{task_name: 'Dinner', task_description: '1. Complete this dashboard 2. Think about whats next', completed:false, scheduled: false}])
