class AddAccessFlgToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :access_flg, :boolean
  end
end
