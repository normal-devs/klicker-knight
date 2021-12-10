import { Command } from '@oclif/command';

export class KlickerKnight extends Command {
  async run() {
    this.log(
      'You helplessly stare into the void as you try to gain your bearings. Your foot catches on what you believe to be a loose flagstone. You fall and break your neck. You are dead.'
    );

    return Promise.resolve();
  }
}
