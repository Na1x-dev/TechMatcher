import re
import psycopg2
from decouple import config

def clean_int(value):
    """Извлекает только цифры из строки и возвращает int. Если пусто или '-', возвращает None."""
    if not value or str(value).strip() in ['-', '', 'None']:
        return None
    # Находим все последовательности цифр
    numbers = re.findall(r'\d+', str(value))
    return int(''.join(numbers)) if numbers else None

def clean_float(value):
    """Извлекает дробное число из строки (например, диагональ '6.67"')."""
    if not value or str(value).strip() in ['-', '', 'None']:
        return None
    # Меняем запятую на точку и ищем вещественное число
    cleaned = str(value).replace(',', '.')
    match = re.search(r'\d+\.\d+|\d+', cleaned)
    return float(match.group()) if match else None

def clean_decimal(value):
    """Извлекает цену и возвращает чистый float/decimal для базы данных."""
    if not value or str(value).strip() in ['-', '', 'Нет в наличии', 'None']:
        return None
    # Убираем пробелы, знаки валют (руб., $, ₸)
    cleaned = re.sub(r'[^\d.,]', '', str(value)).replace(',', '.')
    return float(cleaned) if cleaned else None

def clean_bool(value):
    """Преобразует текстовое описание (Есть/Да/+) в Boolean."""
    if not value:
        return False
    normalized = str(value).strip().lower()
    if normalized in ['есть', 'да', '+', 'true', '1']:
        return True
    return False

def save_smartphone_to_db(data):
    """
    Принимает словарь с сырыми данными от парсера, 
    очищает их и сохраняет в PostgreSQL.
    """
    try:
        connection = psycopg2.connect(
            dbname=config('DB_NAME', default='tech_matcher'),
            user=config('DB_USER', default='postgres'),
            password=config('DB_PASSWORD', default='postgres'),
            host=config('DB_HOST', default='127.0.0.1'),
            port=config('DB_PORT', default='5432')
        )
        cursor = connection.cursor()

        insert_query = """
        INSERT INTO tech_matcher_app_smartphone (
            title, brand, launch_year, price, image_url,
            os_version, screen_size, screen_res, screen_type, screen_fps,
            screen_ratio, screen_protector, ppi, color_count,
            ram_size, ram_type, rom_size, rom_type,
            camera_count, main_camera_mp, camera_type, camera_block,
            max_video_resolution, front_camera_mp, front_camera_aperture,
            cpu, tech_process, gpu,
            edges_material, back_material, back_color, protection,
            length, width, thickness, weight,
            accum_type, accum_volume, charging_power, wireless_charging,
            bluetooth, audio_port, charge_port, wifi, nfc, has_5g,
            sim_count, sim_type
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        );
        """

        # Строгое приведение типов перед отправкой в базу данных
        cleaned_values = (
            str(data.get('title', 'Unknown')),
            str(data.get('brand', 'Unknown')),
            clean_int(data.get('launch_year')),
            clean_decimal(data.get('price')),
            str(data.get('image_url', '')) if data.get('image_url') else None,
            
            str(data.get('os_version', '')),
            clean_float(data.get('screen_size')),
            str(data.get('screen_res', '')),
            str(data.get('screen_type', '')),
            clean_int(data.get('screen_fps')),
            
            str(data.get('screen_ratio', '')),
            str(data.get('screen_protector', '')),
            clean_int(data.get('ppi')),
            str(data.get('color_count', '')),
            
            clean_int(data.get('ram_size')),
            str(data.get('ram_type', '')),
            clean_int(data.get('rom_size')),
            str(data.get('rom_type', '')),
            
            clean_int(data.get('camera_count')) or 1,
            str(data.get('main_camera_mp', '')),
            str(data.get('camera_type', '')),
            str(data.get('camera_block', '')),
            
            str(data.get('max_video_resolution', '')),
            str(data.get('front_camera_mp', '')),
            str(data.get('front_camera_aperture', '')),
            
            str(data.get('cpu', '')),
            str(data.get('tech_process', '')),
            str(data.get('gpu', '')),
            
            str(data.get('edges_material', '')),
            str(data.get('back_material', '')),
            str(data.get('back_color', '')),
            str(data.get('protection', '')),
            clean_float(data.get('length')),
            clean_float(data.get('width')),
            clean_float(data.get('thickness')),
            clean_float(data.get('weight')),
            
            str(data.get('accum_type', '')),
            clean_int(data.get('accum_volume')),
            clean_int(data.get('charging_power')),
            clean_bool(data.get('wireless_charging')),
            
            str(data.get('bluetooth', '')),
            str(data.get('audio_port', '')),
            str(data.get('charge_port', '')),
            str(data.get('wifi', '')),
            clean_bool(data.get('nfc')),
            clean_bool(data.get('has_5g')),
            clean_int(data.get('sim_count')) or 2,
            str(data.get('sim_type', ''))
        )

        cursor.execute(insert_query, cleaned_values)
        connection.commit()
        
    except Exception as error:
        print(f"Ошибка при записи смартфона в базу данных: {error}")
    finally:
        if connection:
            cursor.close()
            connection.close()

# Пример запуска / тестирования функции
if __name__ == "__main__":
    # Тестовый сырой объект, имитирующий результат парсинга сайта (например, с характеристиками в виде строк)
    raw_parsed_data = {
        "title": "iPhone 15 Pro",
        "brand": "Apple",
        "launch_year": "2023 г.",
        "price": "120 000 руб.",
        "screen_size": '6.1"',
        "screen_fps": "120 Гц",
        "ram_size": "8 ГБ",
        "rom_size": "256 ГБ",
        "accum_volume": "3274 мАч",
        "wireless_charging": "Есть",
        "nfc": "+",
        "has_5g": "Да"
    }
    
    print("Запуск тестового сохранения...")
    # save_smartphone_to_db(raw_parsed_data)
