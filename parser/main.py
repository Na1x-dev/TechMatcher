import sqlite3
import os
import psycopg2
from bs4 import BeautifulSoup
import requests

DB_TABLE = "tech_matcher"
URL = "https://catalog.onliner.by/mobile?mobile_type%5B0%5D=smartphone&mobile_type%5Boperation%5D=union&page="


def create_connect():
    conn = psycopg2.connect(
        dbname=DB_TABLE,
        user="postgres",
        password="1234",
        # host="db",
        host="127.0.0.1",
        port="5432"
    )
    return conn

def parse_mobile_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Найдем все элементы, содержащие ссылки на объекты внутри catalog-form__offers-list
    offers_list = soup.select('.catalog-form__offers-list .catalog-form__link_primary-additional')

    for item in offers_list:
        link = item['href']  # Получаем ссылку на объект
        print(f"Парсинг объекта: {link}")
        parse_object(link)

def parse_object(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Извлечение информации из таблицы
    table = soup.find('table')  # Найдите нужную таблицу
    if table:
        rows = table.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            for cell in cells:
                print(cell.get_text(strip=True))  # Печатаем текст ячейки
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
