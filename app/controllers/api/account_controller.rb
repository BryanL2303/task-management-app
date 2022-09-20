module Api
	class AccountController < ApplicationController
		protect_from_forgery with: :null_session

		def createAccount
			account = Account.new(name: params[:name], password: params[:password])

			if account == nil
				if account.save
					render json: {'id': account.id, "name": account.name}
				else
					render json: {error: account.errors.messages}, status: 422
				end
			else
				render json: false
			end
			
		end

		def authenticateAccount
			account = Account.find_by(name: params[:name])
			if account == nil
				render json: false
			else
				if account.password == params[:password]
					render json: {'id': account.id, "name": account.name}
				else
					render json: false
				end
			end
		end

		def destroy
			account = Account.find_by(id: params[:account_id])
			tasks = Task.where(account_id: account.id)
			projects = Project.where(account_id: account.id)
			tasks.destroy_all
			projects.destroy_all

			if account.destroy
				head :no_content
			else
				render json: {error: account.errors.messages}, status: 422
			end
		end

		def show
			account = Account.find_by(id: params[:account_id])

			render json: AccountSerializer.new(account).serialized_json
		end

		def getProjects
			projects = Project.where(account_id: params[:id])

			render json: ProjectSerializer.new(projects).serialized_json
		end

		def getUnscheduledTasks
			tasks = Task.where("account_id = ? AND scheduled = ?", params[:id],
			 'false').order("task_priority")

			render json: TaskSerializer.new(tasks).serialized_json
		end

		def getTasksByDate
			tasks = Task.where("account_id = ? AND calender_id = ?", params[:id],
			 params[:calender_id]).order("time")

			render json: TaskSerializer.new(tasks).serialized_json
		end

		def getTasksByProject
			tasks = Task.where("account_id = ? AND project_id = ?", params[:id],
			 params[:project_id]).order("task_priority")

			render json: TaskSerializer.new(tasks).serialized_json
		end
	end
end