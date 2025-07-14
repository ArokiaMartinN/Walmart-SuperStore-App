import cv2
import datetime

# Load Haar cascade for face detection
face_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

# Open webcam or video stream
cap = cv2.VideoCapture(0)  # Change to "your_file.mp4" or IP stream if needed

# Define zones: (x1, y1, x2, y2)
zones = {
    "Zone A - Snacks": (50, 50, 300, 300),
    "Zone B - Checkout": (320, 50, 600, 300),
    "Zone C - Frozen": (50, 320, 600, 480)
}

def count_faces_in_zone(faces, zone_coords):
    x1, y1, x2, y2 = zone_coords
    count = 0
    for (x, y, w, h) in faces:
        cx, cy = x + w // 2, y + h // 2
        if x1 <= cx <= x2 and y1 <= cy <= y2:
            count += 1
    return count

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Resize for performance
    frame = cv2.resize(frame, (640, 480))

    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    # Draw zones
    for zone_name, coords in zones.items():
        x1, y1, x2, y2 = coords
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        count = count_faces_in_zone(faces, coords)
        cv2.putText(frame, f"{zone_name}: {count}", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

    # Draw detected faces
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

    # Timestamp
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    cv2.putText(frame, f"Time: {timestamp}", (10, 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    # Show frame
    cv2.imshow("D-Mart Crowd Tracker", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
