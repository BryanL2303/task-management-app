module Api
	class TaskController < ApplicationController
		protect_from_forgery with: :null_session
		def show
			task = Task.find_by(id: params[:id])

			render json: TaskSerializer.new(task).serialized_json
		end

		def destroy
			task = Task.find_by(id: params[:id])

			if task.destroy
				head :no_content
			else
				render json: {error: task.errors.messages}, status: 422
			end
		end

		def createTask
			if params[:task][:scheduled]
				timeString = params[:task][:time]
				time = Time.utc(2022, 8, 29, timeString[0, 2], timeString[2, 2], 0)				
			else
				time = nil
			end

			task = Task.new(time: time, task_name: params[:task][:task_name],
				  task_description: params[:task][:task_description],
				  scheduled: params[:task][:scheduled], project_id: params[:task][:project_id],
				  calender_id: params[:task][:calender_id],
				  task_priority: params[:task][:task_priority],
				  account_id: params[:task][:account_id],
				  tag: params[:task][:tag], on_calender: params[:task][:on_calender])

			if task.save!
				render json: TaskSerializer.new(task).serialized_json
			else
				render json: {error: task.errors.messages}, status: 422
			end
		end

		def updateTask
			task = Task.find(params[:id])
			if(params[:time] != nil)
				timeString = params[:time]
				time = Time.utc(2022, 8, 29, timeString[0, 2], timeString[2, 2], 0)
				task.time = time
				if task.save
			      	render json: TaskSerializer.new(task).serialized_json
				else
					render json: {error: task.errors.messages}, status: 422
				end
			else
				if task.update(task_param)
			      	render json: TaskSerializer.new(task).serialized_json
				else
					render json: {error: task.errors.messages}, status: 422
				end	
			end	   
		end

		def rescheduleTask
			task = Task.find_by(id:params[:id])

			if params[:task][:calender_id] == "unscheduled"
				task.scheduled = false
				task.time = nil
				task.calender_id = nil
			else
				date = Calender.find_by(id: params[:task][:calender_id])
				task.scheduled = true
				task.time = nil
				task.calender_id = date.id
			end

			if task.save
				render json: TaskSerializer.new(task).serialized_json
			else
				render json: {error: task.errors.messages}, status: 422
			end
		end

		private
		def task_param
			params.require(:task).permit(:id, :task_name, :completed, :scheduled, :task_description, :time, :calender_id, :project_id, :task_priority, :on_calender)
		end
	end
end