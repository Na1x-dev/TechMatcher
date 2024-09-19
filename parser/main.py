import requests
from bs4 import BeautifulSoup
import psycopg2

DB_NAME = "tech_matcher"
URL = "https://catalog.onliner.by/mobile?mobile_type%5B0%5D=smartphone&mobile_type%5Boperation%5D=union&page="
INSERT_QUERY = """
    INSERT INTO tech_matcher_app_smartphone (
        launch_year, os_version, screen_size, screen_res, screen_type,
        screen_fps, ram_size, ram_type, rom_size, rom_type,
        camera_count, main_camera_mp, camera_type, camera_block,
        max_video_resolution, front_camera_mp, front_camera_aperture,
        cpu, tech_process, gpu, edges_material, back_material,
        back_color, protection, length, width, thickness,
        weight, screen_ratio, screen_protector, color_count,
        ppi, accum_type, accum_volume, charging_power,
        wireless_charging, bluetooth, audio_port, charge_port,
        wifi, nfc, _5g, sim_count, sim_type, title, image_url, price
    ) VALUES (%s) RETURNING id;
    """
COLUMN_MAPPING = {
            "Дата выхода на рынок": "launch_year",
            "Версия ОС на момент выхода": "os_version",
            "Размер экрана": "screen_size",
            "Разрешение экрана": "screen_res",
            "Технология экрана": "screen_type",
            "Частота обновления экрана": "screen_fps",
            "Объем оперативной памяти": "ram_size",
            "Тип оперативной памяти": "ram_type",
            "Объем встроенной памяти": "rom_size",
            "Тип встроенной памяти": "rom_type",
            "Количество основных камер": "camera_count",
            "Количество точек матрицы основной камеры": "main_camera_mp",
            "Модули камер": "camera_type",
            "Характеристики блока камер": "camera_block",
            "Максимальное разрешение видео": "max_video_resolution",
            "Фронтальная камера": "front_camera_mp",
            "Диафрагма фронтальной камеры": "front_camera_aperture",
            "Процессор": "cpu",
            "Техпроцесс": "tech_process",
            "Графический ускоритель": "gpu",
            "Материал граней": "edges_material",
            "Материал задней крышки": "back_material",
            "Цвет задней крышки": "back_color",
            "Пыле- и влагозащита": "protection",
            "Длина": "length",
            "Ширина": "width",
            "Толщина": "thickness",
            "Вес": "weight",
            "Соотношение сторон": "screen_ratio",
            "Защита от царапин": "screen_protector",
            "Количество цветов экрана": "color_count",
            "Разрешающая способность экрана": "ppi",
            "Тип аккумулятора": "accum_type",
            "Емкость аккумулятора": "accum_volume",
            "Мощность зарядки": "charging_power",
            "Беспроводная зарядка": "wireless_charging",
            "Bluetooth": "bluetooth",
            "Аудиовыход": "audio_port",
            "Разъём подключения": "charge_port",
            "Wi-Fi": "wifi",
            "NFC": "nfc",
            "5G": "_5g",
            "Количество физических SIM-карт": "sim_count",
            "Формат SIM-карты": "sim_type",
            "Название":"title",
            "Картинка":"image_url",
            "Стоимость":"price"
        }


def create_connect():
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user="postgres",
        password="1234",
        host="127.0.0.1",
        port="5432"
    )
    return conn


def insert_data(data):
    conn = create_connect()
    cursor = conn.cursor()
    try:
        cursor.execute(INSERT_QUERY.replace('%s', ', '.join(['%s'] * len(data))), data)
        conn.commit()
    except psycopg2.errors.SyntaxError as e:
        print(f"Error inserting data: {e}")
        print(f"Data: {data}")
        print(f"INSERT_QUERY: {INSERT_QUERY}")
        raise e
    finally:
        cursor.close()
        conn.close()


    
def parse_mobile_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    offers_list = soup.select('.catalog-form__offers-list .catalog-form__link_base-additional')
    for item in offers_list:
        link = item['href']
        print(f"Парсинг объекта: {link}")
        parse_object(link)


def parse_object(url):
    data = {column: "-" for column in COLUMN_MAPPING.values()}
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    data['title'] = soup.select_one('h1.catalog-masthead__title.js-nav-header').text.strip() if soup.select_one('h1.catalog-masthead__title.js-nav-header') else "-"
    
    data['image_url'] = soup.select_one('div.fotorama__stage__frame img')['src'] if soup.select_one('div.fotorama__stage__frame img') else "-"
    
    data['price'] = soup.select_one('div.offers-description__price a').text.strip() if soup.select_one('div.offers-description__price a') else "-"
    
    data['nfc'] = bool(soup.select_one('td:contains("NFC") + td span.i-tip'))  # True если есть i-tip
    data['_5g'] = bool(soup.select_one('td:contains("5G") + td span.i-tip'))  # True если есть i-tip
    
    table = soup.find('table')
    
    if table:
        rows = table.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            if len(cells) >= 2:
                key = cells[0].contents[0].strip()  
                value = cells[1].text.strip()  
                if key in COLUMN_MAPPING:
                    data[COLUMN_MAPPING[key]] = value if value else "-"

        for col in COLUMN_MAPPING.values():
            if col not in data or data[col] == "":
                data[col] = False 
        insert_data(tuple(data[col] for col in COLUMN_MAPPING.values()))
        print("Данные сохранены в базе данных.")
    else:
        print("Таблица не найдена на странице.")


def main():
    page = 1
    while True:
        response = requests.get(URL + str(page))
        if response.status_code != 200:
            print("Нет больше страниц для парсинга.")
            break
        parse_mobile_page(URL + str(page))
        page += 1


if __name__ == "__main__":
    main()
