'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmailLog {
  id: string;
  order_id: string;
  order_display_id: string;
  email_type: 'order_confirmation' | 'shipping_notification' | 'delivery_confirmation';
  recipient_email: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed';
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
}

const emailTypeLabels: Record<string, string> = {
  order_confirmation: 'Order Confirmation',
  shipping_notification: 'Shipping Notification',
  delivery_confirmation: 'Delivery Confirmation',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  sent: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  sent: CheckCircle,
  failed: XCircle,
};

export default function EmailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [emailType, setEmailType] = useState(searchParams.get('type') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [resending, setResending] = useState<string | null>(null);
  const limit = 20;

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (emailType) params.set('type', emailType);
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const res = await fetch(`/api/admin/emails?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setEmails(data.emails);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    } finally {
      setLoading(false);
    }
  }, [search, status, emailType, page]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const updateUrl = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/admin/emails?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateUrl({ search, page: '1' });
  };

  const handleResend = async (emailId: string) => {
    setResending(emailId);
    try {
      const res = await fetch(`/api/admin/emails/${emailId}/resend`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchEmails();
      }
    } catch (error) {
      console.error('Failed to resend email:', error);
    } finally {
      setResending(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email or order ID..."
                className="w-full pl-10 pr-4 py-2.5 border border-charcoal/15 rounded-lg focus:ring-2 focus:ring-deep-ochre focus:border-transparent outline-none"
              />
            </div>
          </form>

          {/* Status filter */}
          <Select
            value={status || "all"}
            onValueChange={(val) => {
              const newStatus = val === "all" ? "" : val;
              setStatus(newStatus);
              setPage(1);
              updateUrl({ status: newStatus, page: '1' });
            }}
          >
            <SelectTrigger className="w-full md:w-[160px] shrink-0 px-4 py-2.5 border border-charcoal/15 rounded-lg h-auto">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          {/* Type filter */}
          <Select
            value={emailType || "all"}
            onValueChange={(val) => {
              const newType = val === "all" ? "" : val;
              setEmailType(newType);
              setPage(1);
              updateUrl({ type: newType, page: '1' });
            }}
          >
            <SelectTrigger className="w-full md:w-[200px] shrink-0 px-4 py-2.5 border border-charcoal/15 rounded-lg h-auto">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="order_confirmation">Order Confirmation</SelectItem>
              <SelectItem value="shipping_notification">Shipping Notification</SelectItem>
              <SelectItem value="delivery_confirmation">Delivery Confirmation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Emails Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-ochre mx-auto"></div>
          </div>
        ) : emails.length === 0 ? (
          <div className="p-8 text-center text-charcoal/50">
            <Mail className="w-12 h-12 mx-auto mb-4 text-charcoal/20" />
            <p>No emails found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-warm-ivory/50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                      Email Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                      Sent At
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-charcoal/50 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/10">
                  {emails.map((email) => {
                    const StatusIcon = statusIcons[email.status];
                    return (
                      <tr key={email.id} className="hover:bg-deep-ochre/5">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-charcoal/40" />
                            <span className="text-sm font-medium text-charcoal">
                              {emailTypeLabels[email.email_type]}
                            </span>
                          </div>
                          <p
                            className="text-xs text-charcoal/50 mt-1 truncate max-w-xs"
                            title={email.subject}
                          >
                            {email.subject}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-charcoal">
                            {email.recipient_email}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/orders/${email.order_display_id}`}
                            className="text-sm font-mono text-deep-ochre hover:text-deep-ochre/80"
                          >
                            {email.order_display_id}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                statusColors[email.status]
                              }`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {email.status.charAt(0).toUpperCase() +
                                email.status.slice(1)}
                            </span>
                            {email.error_message && (
                              <p
                                className="text-xs text-red-500 mt-1 truncate max-w-xs"
                                title={email.error_message}
                              >
                                {email.error_message}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-charcoal/50">
                          {email.sent_at
                            ? new Date(email.sent_at).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {email.status === 'failed' && (
                            <button
                              onClick={() => handleResend(email.id)}
                              disabled={resending === email.id}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-deep-ochre hover:text-deep-ochre/80 hover:bg-deep-ochre/5 rounded-lg transition disabled:opacity-50"
                            >
                              <RefreshCw
                                className={`w-4 h-4 ${
                                  resending === email.id ? 'animate-spin' : ''
                                }`}
                              />
                              Resend
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <p className="text-sm text-charcoal/50">
                  Showing {(page - 1) * limit + 1} to{' '}
                  {Math.min(page * limit, total)} of {total} emails
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPage(page - 1);
                      updateUrl({ page: (page - 1).toString() });
                    }}
                    disabled={page === 1}
                    className="p-2 rounded-lg border hover:bg-deep-ochre/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => {
                      setPage(page + 1);
                      updateUrl({ page: (page + 1).toString() });
                    }}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border hover:bg-deep-ochre/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
