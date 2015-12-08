//This works with the larger pcb Green Motor Drivers - 15A


int RCch1Steer; 
int RCch2Throttle;
int RCch3Headspin;
int move; 
int turn;
int headspin;
float divmove;
float doturn;

void setup() {

 pinMode(A0, OUTPUT);
 pinMode(A1, INPUT); 
 pinMode(A2, INPUT);
 pinMode(A3, INPUT);
 pinMode(3, OUTPUT); 
 pinMode(5, OUTPUT);
 pinMode(6, OUTPUT);
 pinMode(7, OUTPUT);
 pinMode(8, OUTPUT);
 pinMode(9, OUTPUT);
 
 analogWrite(3, 0);  
 analogWrite(5, 0);
 analogWrite(9, 0);
 digitalWrite(7, LOW);
 delay(2000);
 digitalWrite(A0, HIGH);
 
  
//  Serial.begin(9600);
}

void loop() {
 
 RCch1Steer = pulseIn(A1, HIGH, 25000);
 RCch2Throttle = pulseIn(A2, HIGH, 25000);
 RCch3Headspin = pulseIn(A3, HIGH, 25000);
 
 if (RCch2Throttle >= 1510) {move = map(RCch2Throttle, 1510, 2010, 0, 255);}
 else if (RCch2Throttle <= 1440) {move = map(RCch2Throttle, 1440, 950, 0, -255);}
 else move = 0;
 
if(move>0){digitalWrite(6, HIGH);digitalWrite(8, HIGH);}
if(move<0){digitalWrite(6, LOW);digitalWrite(8, LOW); move=abs(move);}
 
 if (RCch1Steer >= 1510) {turn = map(RCch1Steer, 1510, 2000, 0, 255);}
 else if (RCch1Steer <= 1480) {turn = map(RCch1Steer, 1480, 990, 0, -255);}
 else turn = 0;

divmove = (float)move / 255;
doturn = divmove * (float)turn;

if(doturn>=0){analogWrite(5, move-doturn); analogWrite(3, move);}
if(doturn<0){doturn=abs(doturn); analogWrite(3, move-doturn); analogWrite(5, move);}

if(turn >0 & move==0){digitalWrite(6, HIGH);digitalWrite(8, LOW); analogWrite(5, turn); analogWrite(3, turn);}
if(turn <0 & move==0){turn=abs(turn); digitalWrite(6, LOW);digitalWrite(8, HIGH); analogWrite(5, turn); analogWrite(3, turn);}

//headspin
 if (RCch3Headspin >= 1015) {headspin = map(RCch3Headspin, 1015, 1070, 0, 255);}
 else if (RCch3Headspin <= 975) {headspin = map(RCch3Headspin, 975, 920, 0, -255);}
 else headspin = 0;

if(headspin>=0){digitalWrite(7, HIGH); analogWrite(9, headspin);}
if(headspin<0){digitalWrite(7, LOW); headspin=abs(headspin); analogWrite(9, headspin);}


//Serial.print("Chan 1 (LEFT/RIGHT):"); 
//Serial.println(RCch1Steer);
//Serial.print("Chan 2 (FORWARD/REVERSE):");
//Serial.println(RCch2Throttle);
//Serial.print("Chan 3 (HEADSPIN):");
//Serial.println(RCch3Headspin);
//Serial.print("Move:");
//Serial.println(move);
//Serial.print("Turn:");
//Serial.println(turn);
//Serial.print("Move divided by 255:");
//Serial.println(divmove);
//Serial.print("Do Turn:");
//Serial.println(doturn);
//Serial.println();
//Serial.println();
//Serial.println();
//delay(2000);

}