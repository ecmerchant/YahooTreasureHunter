class AddTrialFlgToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :trial_flg, :boolean
  end
end
