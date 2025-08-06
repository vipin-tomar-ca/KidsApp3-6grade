import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  CloudOff, 
  Sync, 
  Shield, 
  Database,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Trash2,
  Users,
  Lock
} from "lucide-react";
import { Alert, Badge, ProgressBar, Modal, Form, Spinner } from "react-bootstrap";
import { contentService } from '@/services/contentService';
import { useChildSafety } from '@/hooks/useChildSafety';

interface SyncStatus {
  isConnected: boolean;
  lastSync: Date | null;
  pendingSync: number;
  errors: string[];
  cacheSize: { content: number; progress: number };
}

interface FirebaseSyncProps {
  userId: string;
  onSyncComplete?: (status: SyncStatus) => void;
  className?: string;
}

const FirebaseSync: React.FC<FirebaseSyncProps> = ({
  userId,
  onSyncComplete,
  className
}) => {
  const { currentUser, parentalDashboard, updateParentalSettings } = useChildSafety();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    lastSync: null,
    pendingSync: 0,
    errors: [],
    cacheSize: { content: 0, progress: 0 }
  });
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentPassword, setConsentPassword] = useState('');
  const [showDataExport, setShowDataExport] = useState(false);
  const [exportData, setExportData] = useState<any>(null);

  useEffect(() => {
    checkSyncStatus();
    
    // Check sync status every 5 minutes
    const interval = setInterval(checkSyncStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userId]);

  const checkSyncStatus = async () => {
    try {
      const cacheSize = await contentService.getCacheSize();
      const lastSyncStr = localStorage.getItem(`lastSync_${userId}`);
      const lastSync = lastSyncStr ? new Date(lastSyncStr) : null;
      
      // Check Firebase connectivity by attempting a simple operation
      let isConnected = false;
      try {
        await contentService.getLessonsByGradeAndSubject(3, 'math', false);
        isConnected = true;
      } catch (error) {
        isConnected = false;
      }

      setSyncStatus({
        isConnected,
        lastSync,
        pendingSync: cacheSize.progress,
        errors: [],
        cacheSize
      });
    } catch (error) {
      console.error('Error checking sync status:', error);
      setSyncStatus(prev => ({
        ...prev,
        errors: ['Failed to check sync status']
      }));
    }
  };

  const handleSyncRequest = () => {
    if (parentalDashboard.dataCollectionConsent) {
      performSync();
    } else {
      setShowConsentModal(true);
    }
  };

  const handleConsentSubmit = async () => {
    // Verify parental password (simple check - in production use proper auth)
    if (consentPassword === parentalDashboard.parentalPassword) {
      await updateParentalSettings({
        dataCollectionConsent: true,
        cloudSyncEnabled: true
      });
      setShowConsentModal(false);
      setConsentPassword('');
      performSync();
    } else {
      alert('Incorrect parental password');
    }
  };

  const performSync = async () => {
    setIsSyncing(true);
    
    try {
      // Sync user progress with parental consent
      const result = await contentService.syncUserProgress(
        userId, 
        parentalDashboard.dataCollectionConsent
      );

      // Update sync status
      localStorage.setItem(`lastSync_${userId}`, new Date().toISOString());
      
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        pendingSync: Math.max(0, prev.pendingSync - result.synced),
        errors: result.errors > 0 ? [`${result.errors} items failed to sync`] : []
      }));

      if (onSyncComplete) {
        onSyncComplete(syncStatus);
      }

      console.log(`Sync completed: ${result.synced} items synced, ${result.errors} errors`);
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus(prev => ({
        ...prev,
        errors: [...prev.errors, 'Sync operation failed']
      }));
    } finally {
      setIsSyncing(false);
    }
  };

  const exportUserData = async () => {
    try {
      const data = await contentService.exportUserData(userId);
      setExportData(data);
      setShowDataExport(true);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export user data');
    }
  };

  const downloadExportData = () => {
    if (!exportData) return;
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_data_${userId}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteUserData = async () => {
    if (!confirm('Are you sure you want to delete all user data? This action cannot be undone.')) {
      return;
    }

    try {
      await contentService.deleteUserData(userId);
      alert('User data deleted successfully');
      checkSyncStatus();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete user data');
    }
  };

  const clearCache = async () => {
    try {
      await contentService.clearCache();
      alert('Cache cleared successfully');
      checkSyncStatus();
    } catch (error) {
      console.error('Clear cache failed:', error);
      alert('Failed to clear cache');
    }
  };

  return (
    <div className={className}>
      <Card className="rounded-4 shadow-lg">
        <CardHeader>
          <CardTitle className="h5 d-flex align-items-center">
            {syncStatus.isConnected ? (
              <Cloud className="me-2 text-success" size={20} />
            ) : (
              <CloudOff className="me-2 text-danger" size={20} />
            )}
            Firebase Sync & Data Management
            <Badge bg={syncStatus.isConnected ? 'success' : 'warning'} className="ms-2">
              {syncStatus.isConnected ? 'Connected' : 'Offline'}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Connection Status */}
          <Alert variant={syncStatus.isConnected ? 'success' : 'warning'} className="mb-3">
            <div className="d-flex align-items-center">
              <Database className="me-2" size={16} />
              <div>
                <strong>Status:</strong> {syncStatus.isConnected ? 'Connected to Firebase' : 'Working Offline'}
                {syncStatus.lastSync && (
                  <div className="small text-muted mt-1">
                    Last sync: {syncStatus.lastSync.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </Alert>

          {/* Sync Controls */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Button
                onClick={handleSyncRequest}
                disabled={isSyncing || !syncStatus.isConnected}
                className="w-100 d-flex align-items-center justify-content-center"
                variant="outline"
              >
                {isSyncing ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Sync className="me-2" size={16} />
                    Sync Progress ({syncStatus.pendingSync})
                  </>
                )}
              </Button>
            </div>
            
            <div className="col-md-6">
              <Button
                onClick={exportUserData}
                variant="outline"
                className="w-100 d-flex align-items-center justify-content-center"
              >
                <Download className="me-2" size={16} />
                Export Data
              </Button>
            </div>
          </div>

          {/* Cache Information */}
          <Card className="border-light mb-3">
            <CardContent className="p-3">
              <h6 className="fw-bold mb-2">Offline Cache</h6>
              <div className="row g-2 text-center">
                <div className="col-6">
                  <div className="bg-light rounded p-2">
                    <div className="fw-bold text-primary">{syncStatus.cacheSize.content}</div>
                    <small className="text-muted">Lessons Cached</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-light rounded p-2">
                    <div className="fw-bold text-success">{syncStatus.cacheSize.progress}</div>
                    <small className="text-muted">Progress Items</small>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={clearCache}
                variant="outline"
                size="sm"
                className="w-100 mt-2"
              >
                <Trash2 className="me-1" size={14} />
                Clear Cache
              </Button>
            </CardContent>
          </Card>

          {/* COPPA Compliance Section */}
          <Alert variant="info" className="mb-3">
            <Shield className="me-2" size={16} />
            <div>
              <strong>COPPA Compliance:</strong>
              <ul className="mb-0 mt-2 small">
                <li>Data syncing requires parental consent</li>
                <li>All data stored locally by default</li>
                <li>Cloud sync only with explicit permission</li>
                <li>Data export and deletion available</li>
              </ul>
            </div>
          </Alert>

          {/* Consent Status */}
          <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded mb-3">
            <div className="d-flex align-items-center">
              <Users className="me-2 text-primary" size={16} />
              <div>
                <div className="fw-bold small">Parental Consent Status</div>
                <div className="text-muted small">
                  {parentalDashboard.dataCollectionConsent ? 'Granted' : 'Not granted'}
                </div>
              </div>
            </div>
            
            {parentalDashboard.dataCollectionConsent ? (
              <CheckCircle className="text-success" size={20} />
            ) : (
              <Lock className="text-warning" size={20} />
            )}
          </div>

          {/* Error Display */}
          {syncStatus.errors.length > 0 && (
            <Alert variant="danger" className="mb-3">
              <AlertTriangle className="me-2" size={16} />
              <div>
                <strong>Sync Errors:</strong>
                <ul className="mb-0 mt-1">
                  {syncStatus.errors.map((error, index) => (
                    <li key={index} className="small">{error}</li>
                  ))}
                </ul>
              </div>
            </Alert>
          )}

          {/* Data Management */}
          <div className="border-top pt-3">
            <h6 className="fw-bold mb-2">Data Management</h6>
            <div className="d-flex gap-2">
              <Button
                onClick={deleteUserData}
                variant="outline"
                size="sm"
                className="text-danger border-danger flex-fill"
              >
                <Trash2 className="me-1" size={14} />
                Delete All Data
              </Button>
            </div>
            
            <small className="text-muted d-block mt-2">
              Delete all stored progress and cached content for this user. This action cannot be undone.
            </small>
          </div>
        </CardContent>
      </Card>

      {/* Consent Modal */}
      <Modal show={showConsentModal} onHide={() => setShowConsentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5">Parental Consent Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <Shield className="me-2" size={16} />
            To sync learning progress to the cloud, we need parental consent as required by COPPA regulations.
          </Alert>
          
          <Form.Group className="mb-3">
            <Form.Label>Enter Parental Password:</Form.Label>
            <Form.Control
              type="password"
              value={consentPassword}
              onChange={(e) => setConsentPassword(e.target.value)}
              placeholder="Enter the parental dashboard password"
            />
          </Form.Group>
          
          <div className="small text-muted">
            By providing consent, you agree to:
            <ul className="mt-2">
              <li>Store educational progress data in Firebase</li>
              <li>Sync data across devices for this child</li>
              <li>Allow data export and deletion on request</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConsentModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConsentSubmit}
            disabled={!consentPassword.trim()}
          >
            Grant Consent & Sync
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Data Export Modal */}
      <Modal show={showDataExport} onHide={() => setShowDataExport(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="h5">Export User Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            <CheckCircle className="me-2" size={16} />
            User data export ready for download
          </Alert>
          
          {exportData && (
            <div className="bg-light p-3 rounded mb-3">
              <h6>Export Summary:</h6>
              <ul className="mb-0 small">
                <li>User ID: {exportData.userId}</li>
                <li>Export Date: {exportData.exportDate}</li>
                <li>Progress Records: {exportData.progressData?.length || 0}</li>
                <li>Data Policy: {exportData.dataPolicy}</li>
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDataExport(false)}>
            Close
          </Button>
          <Button onClick={downloadExportData}>
            <Download className="me-2" size={16} />
            Download JSON
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FirebaseSync;