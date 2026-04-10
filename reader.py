import os
import sys

# Конфигурация
# Укажите корневые папки для обхода (можно несколько)
ROOT_DIRS = [
    r"C:\Users\saltinskiy\WebstormProjects\backlabs\front",
    r"C:\Users\saltinskiy\WebstormProjects\backlabs\backlabs-api"
]

# Расширения файлов, которые считаются "важными"
INCLUDE_EXTENSIONS = {
    # Исходный код
    '.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.cs',
    # Конфигурации
    '.json', '.yaml', '.yml', '.toml', '.xml', '.env.example',
    # Документация
    '.md', '.txt', '.html', '.css', '.scss', '.less',
    # Docker и прочее
    'Dockerfile', 'docker-compose.yml', '.dockerignore',
    # Другие текстовые файлы
    '.gitignore', '.eslintrc', '.prettierrc', '.env'  # .env включаем, но осторожно – может содержать секреты
}

# Имена файлов без расширения, которые тоже нужно включать
INCLUDE_FILENAMES = {
    'Dockerfile', 'docker-compose.yml', '.gitignore', '.dockerignore',
    '.eslintrc', '.prettierrc', '.env', 'README', 'LICENSE'
}

# Папки, которые следует игнорировать
EXCLUDE_DIRS = {
    'node_modules', 'dist', 'build', 'out', '.git', '.idea', '.vscode',
    '__pycache__', 'venv', 'env', '.env', 'coverage', '.next', '.nuxt',
    'public',  # если хотите исключить сгенерированную статику
    '.cache', '.tmp', 'logs', 'temp', 'tmp'
}

# Файлы, которые игнорировать даже если расширение подходит
EXCLUDE_FILES = {
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',  # большие lock-файлы
    '.DS_Store', 'Thumbs.db'
}

def should_include_file(filepath: str, filename: str) -> bool:
    """Проверяет, нужно ли включать данный файл в отчёт."""
    # Исключаем по полному имени файла
    if filename in EXCLUDE_FILES:
        return False
    # Проверяем точное совпадение имени (без расширения)
    if filename in INCLUDE_FILENAMES:
        return True
    # Проверяем расширение
    _, ext = os.path.splitext(filename)
    if ext.lower() in INCLUDE_EXTENSIONS:
        return True
    # Также если файл без расширения, но имя совпадает с одним из специальных (например, 'Dockerfile')
    if not ext and filename in INCLUDE_FILENAMES:
        return True
    return False

def collect_files(root_dirs: list, output_file: str):
    """Собирает содержимое всех подходящих файлов и записывает в выходной файл."""
    with open(output_file, 'w', encoding='utf-8') as out:
        for root_dir in root_dirs:
            if not os.path.exists(root_dir):
                print(f"Предупреждение: директория {root_dir} не найдена, пропускаем.", file=sys.stderr)
                continue
            for dirpath, dirnames, filenames in os.walk(root_dir):
                # Исключаем ненужные папки из обхода
                dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]

                for filename in filenames:
                    full_path = os.path.join(dirpath, filename)
                    rel_path = os.path.relpath(full_path, start=root_dir)
                    if should_include_file(full_path, filename):
                        print(f"Добавляем: {rel_path}")
                        out.write(f"{'='*80}\n")
                        out.write(f"Файл: {rel_path}\n")
                        out.write(f"Полный путь: {full_path}\n")
                        out.write(f"{'='*80}\n\n")
                        try:
                            with open(full_path, 'r', encoding='utf-8') as f:
                                content = f.read()
                                out.write(content)
                        except UnicodeDecodeError:
                            out.write("[Бинарный файл или не UTF-8, содержимое пропущено]\n")
                        except Exception as e:
                            out.write(f"[Ошибка чтения файла: {e}]\n")
                        out.write("\n\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        output_path = sys.argv[1]
    else:
        output_path = "project_files_dump.txt"
    collect_files(ROOT_DIRS, output_path)
    print(f"Готово! Результат записан в {output_path}")