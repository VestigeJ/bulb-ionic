import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {getColorValue, getWhiteValue, SERVICE_ID, CHARACTERISTIC_ID} from '../../common/consts';

@Component({
  templateUrl: 'device.html'
})
export class DevicePage {
  device: BluetoothDevice;
  characteristic: BluetoothRemoteGATTCharacteristic;
  connecting: boolean = false;
  mode: 'rgb' | 'white' = 'rgb';
  red = 128;
  green = 0;
  blue = 0;
  warmWhite = 0;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams
  ) {
    this.device = this.navParams.get('device');
  }

  ionViewWillEnter() {
    this.connecting = true;
    this.device.gatt.connect()
      .then(server => server.getPrimaryService(SERVICE_ID))
      .then(service => service.getCharacteristic(CHARACTERISTIC_ID))
      .then(characteristic => {
        this.characteristic = characteristic;
        this.connecting = false;
      })
      .catch(err => {
        console.error('BLE Connection failed!', err);
        this.connecting = false;
      });
  }

  ionViewWillLeave() {
    this.device.gatt.disconnect();
  }

  updateColor() {
    let writeValue = getColorValue(this.red, this.green, this.blue);
    this.characteristic.writeValue(writeValue);
  }

  updateWhite() {
    let writeValue = getWhiteValue(this.warmWhite);
    this.characteristic.writeValue(writeValue);
  }
}
