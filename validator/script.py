import json, os, datetime

# Script to validate the JSON File for the Realtime Clipboard Data

""" Find all json files in the current root directory """
def find_json_files(root_dir):
    json_files = []
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".json"):
                json_files.append(os.path.join(dirpath, filename))
    return json_files

""" Function to Validate the Root Nodes (Room ID's) from the JSON File """
def validate_root_nodes_of_the_json_file(file_name):
    try:
        with open(file_name, encoding='utf-8') as file:
            data = json.load(file)
    except UnicodeDecodeError:
        with open(file_name, 'rb') as file:
            data = json.load(file, encoding='latin1')
    if isinstance(data, dict):
        for key in data.keys():
            if len(key) < 5 or len(key) > 5:
                print(f"""\nError: Invalid key length "{key}"" at file "{file_name}". """)
                return False
    return True

"""" Function to validate the Sub Nodes (Room's Data) from the JSON File """
def validate_sub_nodes_of_the_json_file(file_name):
    try:
        with open(file_name, encoding='utf-8') as file:
            data = json.load(file)
    except UnicodeDecodeError:
        with open(file_name, 'rb') as file:
            data = json.load(file, encoding='latin1')
    if isinstance(data, dict):
        for key in data.keys():
            value = data[key]
            if isinstance(value, dict):
                allowed_keys = {"text", "lastUpdated", "images"}
                valid_keys = set(value.keys()) == allowed_keys
                if not valid_keys:
                    unexpected_keys = set(value.keys()) - allowed_keys
                    if len(unexpected_keys) > 0:
                        print(f"""\nError: Unexpected key(s) found in Room ID "{key}" at file "{file_name}". \n Unexpected Keys: {unexpected_keys} """)
                        return False
    return True

def create_directories_if_not_exist():
    os.makedirs('./validator/passed', exist_ok=True)
    os.makedirs('./validator/failed', exist_ok=True)

if __name__ == '__main__':
    # Function to get the All JSON files data from the root directory of Validator folder
    # files = find_json_files("./validator/")
    # print(files)

    # Create the directories if they don't exist
    create_directories_if_not_exist()

    # JSON File Path / Name
    file_name = "./validator/realtime-clipboard-default-rtdb-export.json"

    # Check if the file exists
    if not os.path.exists(file_name):
        print("\n----------------------------------------")
        print("ERROR: File does not exist check file.")
        print("----------------------------------------\n")
        exit(0)

    # Function to Validate the Root Nodes (Room ID's) from the JSON File
    root_data = validate_root_nodes_of_the_json_file(file_name)
    print("\n----------------------------------------")
    print("Root Node Validation Result: ", root_data)
    print("----------------------------------------")

    if not root_data:
        exit(0)

    # Function to validate the Sub Nodes (Room's Data) from the JSON File
    sub_root_data = validate_sub_nodes_of_the_json_file(file_name)
    print("\n----------------------------------------")
    print("Sub Node Validation Result: ", sub_root_data)
    print("----------------------------------------")

    if not sub_root_data:
        exit(0)

    # Rename the JSON File
    current_date_time = datetime.datetime.now().strftime("%Y-%m-%d-T-%H-%M-IST")
    new_file_name = f"realtime-clipboard-default-rtdb-export-{current_date_time}.json"

    if root_data and sub_root_data:
        print("\n----------------------------------------")
        print("JSON File Validation Result: SUCCESS")
        print("----------------------------------------")

        # Updated directory for passed files
        new_path = f"./validator/passed/{new_file_name}"
    else:
        print("\n----------------------------------------")
        print("JSON File Validation Result: FAILED")
        print("----------------------------------------")

        # Updated directory for failed files
        new_path = f"./validator/failed/{new_file_name}"
    
    if not os.path.exists(new_path):
        os.rename(file_name, new_path)
        print(f"\nOperation Result. File saved at: {new_path} \nDate and Time: {current_date_time}.")
    else:
        print(f"\nError: A file with the name {new_file_name} already exists in the destination folder.")

    # Exit the program
    exit(0)
