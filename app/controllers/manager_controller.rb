class ManagerController < ApplicationController
  def edit
    judge = params[:code]
    if judge == "trial" then

      user = params[:email]
      pass = params[:password]

      us = User.find_or_initialize_by(email: user)
      us.update(
        password: pass,
        trial_flg: true
      )
    else
      user = params[:email]
      pass = params[:password]
      us = User.find_or_initialize_by(email: user)
      us.update(
        password: pass,
        trial_flg: false
      )
    end

  end
end
