module Api
	class ProjectController < ApplicationController
		protect_from_forgery with: :null_session
		def destroy
			project = Project.find_by(id: params[:id])
			tasks = Task.where(project_id: project.id)
			tasks.destroy_all

			if project.destroy
				head :no_content
			else
				render json: {error: project.errors.messages}, status: 422
			end
		end

		def show
			project = Project.find_by(id: params[:id])

			render json: ProjectSerializer.new(project, options).serialized_json
		end

		def create_project
			project = Project.new(project_name: params[:project_name],
				project_description: params[:project_description],
				account_id: params[:account_id],
				tag: params[:tag])

			if project.save
				render json: ProjectSerializer.new(project).serialized_json
			else
				render json: {error: project.errors.messages}, status: 422
			end
		end

		def set_description
			project = Project.find_by(id: params[:id])

			project.project_description = params[:project_description]

			if project.save
				render json: ProjectSerializer.new(project).serialized_json
			else
				render json: {error: project.errors.messages}, status: 422
			end
		end

		def setTag
			project = Project.find_by(id: params[:id])
			tasks = Task.where(project_id: project.id)

			project.tag = params[:tag]
			for task in tasks
				task.tag = params[:tag]
				task.save
			end

			if project.save
				render json: ProjectSerializer.new(project).serialized_json
			else
				render json: {error: project.errors.messages}, status: 422
			end
		end

		private
		def options
			@options ||= { include: %i{tasks}}
		end
	end
end