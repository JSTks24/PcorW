use std::fs;

#[tauri::command]
async fn save_neu(data: String) -> Result<(), String> {
    let path = rfd::FileDialog::new()
        .set_title("选择保存文件的位置")
        .add_filter("JSON 文件", &["json"])
        .add_filter("所有文件", &["*"])
        .save_file();

    if let Some(path) = path {
        fs::write(&path, data).map_err(|e| format!("写入文件失败: {}", e))?;
        Ok(())
    } else {
        Err("文件保存被取消".to_string())
    }
}

#[tauri::command]
async fn load_neu() -> Result<String, String> {
    let path = rfd::FileDialog::new()
        .set_title("选择要加载的 JSON 文件")
        .add_filter("JSON 文件", &["json"])
        .add_filter("所有文件", &["*"])
        .pick_file();

    if let Some(path) = path {
        let content = fs::read_to_string(&path).map_err(|e| format!("读取文件失败: {}", e))?;
        Ok(content)
    } else {
        Err("文件加载被取消".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![load_neu, save_neu])
        .run(tauri::generate_context!())
        .expect("NEU 人员管理文件运行失败");
}