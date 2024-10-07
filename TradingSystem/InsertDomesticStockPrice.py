import pandas as pd
import chardet
import oracledb

# Oracle 데이터베이스 연결 설정
dsn = oracledb.makedsn('hana1qct.ctiou0gaq9pg.ap-northeast-2.rds.amazonaws.com', 1521, service_name='ORCL')
conn = oracledb.connect(user='admin', password='oraclerds!', dsn=dsn)

print("Successfully connected to Oracle Database")

# cursor 객체 생성
cursor = conn.cursor()

# CSV 파일 경로
csv_file_path = "/Users/smin/Downloads/071050 과거 데이터 (1).csv"

# 파일의 인코딩을 자동으로 감지
with open(csv_file_path, 'rb') as file:
    result = chardet.detect(file.read())
    encoding = result['encoding']

print(f"Detected file encoding: {encoding}")

# CSV 파일 읽기 (감지된 인코딩 사용)
df = pd.read_csv(csv_file_path, encoding=encoding)

# 데이터프레임 열 이름을 DB 열 이름에 맞게 변경
df.columns = ['trading_date', 'close_price', 'open_price', 'high_price', 'low_price', 'volume', 'change_percentage']

# stockcode 컬럼 추가
df['stockcode'] = '071050'

# 날짜 형식 변환 개선
df['trading_date'] = pd.to_datetime(df['trading_date'].str.strip(), errors='coerce')

# 날짜 변환 실패한 행 확인
if df['trading_date'].isna().any():
    print("날짜 변환에 실패한 행이 있습니다:")
    print(df[df['trading_date'].isna()]['trading_date'])
    # 필요에 따라 해당 행 삭제 또는 추가 처리
    df = df.dropna(subset=['trading_date'])

# 숫자 컬럼 변환 시 예외 처리 함수 정의
def safe_convert_to_float(value):
    try:
        return float(str(value).replace(',', '').replace('%', '').replace(' ', ''))
    except ValueError:
        return None

# 각 컬럼에 변환 적용
numeric_columns = ['close_price', 'open_price', 'high_price', 'low_price', 'change_percentage']
for col in numeric_columns:
    df[col] = df[col].apply(safe_convert_to_float)

# 거래량 변환 함수 수정

df['volume'] = df['volume'].apply(lambda x: x if isinstance(x, float) else float(x.replace('K', '')) if 'K' in x else float(x.replace('M', '')) * 1000 if 'M' in x else float(x))

df['volume'] = df['volume'].round(2)

# 변환 후 누락된 값 확인
print("변환 후 누락된 값 확인:")
print(df.isna().sum())

# 누락된 값이 있는 행 삭제
df = df.dropna()

# 데이터프레임의 데이터 타입 출력 (디버깅용)
print(df.dtypes)
print(df.head())

# 데이터 삽입 쿼리
insert_query = """
    INSERT INTO SECURITIES_DOMESTIC_STOCKPRICES (
        stockcode, trading_date, close_price, open_price, high_price, low_price, volume, change_percentage
    ) VALUES (:1, :2, :3, :4, :5, :6, :7, :8)
"""

# 데이터베이스에 데이터 삽입
rows_inserted = 0
error_rows = []

for index, row in df.iterrows():
    try:
        cursor.execute(insert_query, (
            row['stockcode'],
            row['trading_date'].date(),
            row['close_price'],
            row['open_price'],
            row['high_price'],
            row['low_price'],
            row['volume'],
            row['change_percentage']
        ))
        rows_inserted += 1
        if rows_inserted % 100 == 0:  # Optional: Commit every 100 rows
            conn.commit()
            print(f"Committed {rows_inserted} rows so far")
    except oracledb.DatabaseError as e:
        print(f"Error inserting row {index}: {e}")
        error_rows.append(index)
        conn.rollback()  # 에러 발생 시 롤백

# 최종 커밋 (데이터베이스에 변경사항 저장)
conn.commit()

print(f"Data inserted successfully, total rows inserted: {rows_inserted}")
print(f"Rows with errors: {error_rows}")

# 연결 닫기
cursor.close()
conn.close()
