import React from 'react';
import Card from '../components/common/Card';
import CampaignComposer from '../components/messaging/CampaignComposer';
import DeliveryReport from '../components/messaging/DeliveryReport';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MessagingPage = () => {
  const templates = useSelector((s) => s.templates.items);
  const lists = useSelector((s) => s.contacts.lists);
  const report = useSelector((s) => s.messaging.report);
  const sending = useSelector((s) => s.messaging.loading.send);
  const loadingReport = useSelector((s) => s.messaging.loading.report);
  const errSend = useSelector((s) => s.messaging.error.send);
  const errReport = useSelector((s) => s.messaging.error.report);

  return (
    <div className="space-y-4">
      <Card><CampaignComposer templates={templates} lists={lists} /></Card>
      <Card>
        {loadingReport ? <LoadingSpinner /> : errReport ? <div className="text-red-600">{errReport}</div> : report ? <DeliveryReport report={report} /> : <div>No report yet</div>}
      </Card>
      {sending && <div className="text-sm text-gray-600 px-2">Campaign is starting...</div>}
      {errSend && <div className="text-sm text-red-600 px-2">{errSend}</div>}
    </div>
  );
};

export default MessagingPage;
