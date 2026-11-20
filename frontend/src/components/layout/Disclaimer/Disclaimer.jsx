import { DISCLAIMER } from '@/data/content';
import './Disclaimer.css';

export default function Disclaimer() {
  return (
    <div className="disclaimer" role="note">
      <div className="wrap">{DISCLAIMER}</div>
    </div>
  );
}
